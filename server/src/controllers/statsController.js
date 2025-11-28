import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import User from '../models/User.js';

const getStartOfDay = (d) => {
  const date = new Date(d);
  date.setUTCHours(0, 0, 0, 0);
  return date;
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

  // Simple "leave balance" = total approved leaves this month (or inverse)
  const approvedLeaves = await Leave.find({
    user: userId,
    status: 'Approved',
    startDate: { $gte: start, $lt: end }
  });

  // Calculate total approved leave days
  let totalApprovedLeaveDays = 0;
  approvedLeaves.forEach((leave) => {
    const leaveStart = new Date(leave.startDate);
    const leaveEnd = new Date(leave.endDate);
    const diffTime = leaveEnd - leaveStart;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    totalApprovedLeaveDays += diffDays;
  });

  // Assuming 20 working days per month
  const totalWorkingDaysInMonth = 20;
  const leaveBalance = totalWorkingDaysInMonth - totalApprovedLeaveDays;

  res.json({
    daysWorkedThisMonth: daysWorked,
    approvedLeavesThisMonth: approvedLeaves.length,
    totalApprovedLeaveDays,
    leaveBalance
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
