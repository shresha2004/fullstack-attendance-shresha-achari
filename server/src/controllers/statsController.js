import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import User from '../models/User.js';

const getStartOfDay = (d) => {
  const date = new Date(d);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

// Calculate total leave days between two dates (inclusive)
const calculateLeaveDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

export const getEmployeeStats = async (req, res) => {
  const userId = req.user._id;
  const today = new Date();
  const month = today.getUTCMonth();
  const year = today.getUTCFullYear();

  const start = new Date(Date.UTC(year, month, 1));
  const end = new Date(Date.UTC(year, month + 1, 1));

  const daysWorked = await Attendance.countDocuments({
    user: userId,
    date: { $gte: start, $lt: end },
    clockInTime: { $exists: true }
  });

  // Get approved leaves for this month
  const approvedLeaves = await Leave.find({
    user: userId,
    status: 'Approved',
    startDate: { $gte: start, $lt: end }
  });

  // Calculate total approved leave days
  let totalApprovedLeaveDays = 0;
  approvedLeaves.forEach((leave) => {
    totalApprovedLeaveDays += calculateLeaveDays(leave.startDate, leave.endDate);
  });

  // Get pending leaves for this month
  const pendingLeaves = await Leave.find({
    user: userId,
    status: 'Pending',
    startDate: { $gte: start, $lt: end }
  });

  // Calculate total pending leave days
  let totalPendingLeaveDays = 0;
  pendingLeaves.forEach((leave) => {
    totalPendingLeaveDays += calculateLeaveDays(leave.startDate, leave.endDate);
  });

  // Max 5 leaves per month
  const MAX_LEAVES_PER_MONTH = 5;
  const totalLeaveDaysUsed = totalApprovedLeaveDays + totalPendingLeaveDays;
  const leaveBalance = MAX_LEAVES_PER_MONTH - totalLeaveDaysUsed;

  res.json({
    daysWorkedThisMonth: daysWorked,
    approvedLeavesThisMonth: approvedLeaves.length,
    pendingLeavesThisMonth: pendingLeaves.length,
    totalApprovedLeaveDays,
    totalPendingLeaveDays,
    totalLeaveDaysUsed,
    leaveBalance: Math.max(0, leaveBalance),
    maxLeavesPerMonth: MAX_LEAVES_PER_MONTH
  });
};

export const getAdminStats = async (req, res) => {
  const today = getStartOfDay(new Date());

  const allEmployees = await User.find({ role: 'employee' }).select('_id email');

  const todaysAttendance = await Attendance.find({
    date: today,
    clockInTime: { $exists: true }
  }).select('user');

  const presentIds = new Set(todaysAttendance.map((a) => String(a.user)));

  const absentToday = allEmployees.filter((e) => !presentIds.has(String(e._id)));

  // pending leaves count
  const pendingLeavesCount = await Leave.countDocuments({ status: 'Pending' });

  res.json({
    absentToday,
    pendingLeavesCount
  });
};
