import Leave from '../models/Leave.js';
import { z } from 'zod';

// Validation schema for leave application
const leaveSchema = z.object({
  startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  endDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason too long')
});

// Calculate total leave days between two dates (inclusive)
const calculateLeaveDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

export const applyLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;

    // Validate input
    const validation = leaveSchema.safeParse({ startDate, endDate, reason });
    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation error',
        errors: validation.error.errors
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({ message: 'End date must be after or equal to start date' });
    }

    if (start < new Date(new Date().toISOString().split('T')[0])) {
      return res.status(400).json({ message: 'Cannot apply leave for past dates' });
    }

    // Calculate leave days for this application
    const leaveDaysRequested = calculateLeaveDays(startDate, endDate);

    // Get current month and year from start date
    const startMonth = start.getUTCMonth();
    const startYear = start.getUTCFullYear();
    const monthStart = new Date(Date.UTC(startYear, startMonth, 1));
    const monthEnd = new Date(Date.UTC(startYear, startMonth + 1, 1));

    // Count approved leave days in the same month
    const approvedLeavesThisMonth = await Leave.find({
      user: req.user._id,
      status: 'Approved',
      startDate: { $gte: monthStart, $lt: monthEnd }
    });

    let totalApprovedDays = 0;
    approvedLeavesThisMonth.forEach((leave) => {
      totalApprovedDays += calculateLeaveDays(leave.startDate, leave.endDate);
    });

    // Also count pending leaves in the same month
    const pendingLeavesThisMonth = await Leave.find({
      user: req.user._id,
      status: 'Pending',
      startDate: { $gte: monthStart, $lt: monthEnd }
    });

    let totalPendingDays = 0;
    pendingLeavesThisMonth.forEach((leave) => {
      totalPendingDays += calculateLeaveDays(leave.startDate, leave.endDate);
    });

    const totalLeaveDaysUsed = totalApprovedDays + totalPendingDays;
    const MAX_LEAVES_PER_MONTH = 5;

    // Check if adding this leave would exceed the limit
    if (totalLeaveDaysUsed + leaveDaysRequested > MAX_LEAVES_PER_MONTH) {
      return res.status(400).json({
        message: `Leave limit exceeded. You have ${totalLeaveDaysUsed} days pending/approved this month. Maximum allowed: ${MAX_LEAVES_PER_MONTH} days. Requested: ${leaveDaysRequested} days.`,
        leaveBalance: MAX_LEAVES_PER_MONTH - totalLeaveDaysUsed,
        requested: leaveDaysRequested
      });
    }

    const leave = await Leave.create({
      user: req.user._id,
      startDate,
      endDate,
      reason
    });

    res.status(201).json({
      message: 'Leave applied successfully',
      leave,
      leaveBalance: MAX_LEAVES_PER_MONTH - (totalLeaveDaysUsed + leaveDaysRequested)
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to apply leave' });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leaves' });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const leaves = await Leave.find(filter)
      .populate('user', 'email name role employeeId')
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leaves' });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Approved or Rejected' });
    }

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    leave.status = status;
    await leave.save();

    res.json({
      message: `Leave ${status.toLowerCase()} successfully`,
      leave
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update leave status' });
  }
};
