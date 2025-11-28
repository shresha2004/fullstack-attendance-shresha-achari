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

  // Simple “leave balance” = total approved leaves this month (or inverse)
  const approvedLeaves = await Leave.find({
    user: userId,
    status: 'Approved',
    startDate: { $gte: start, $lt: end }
  });

  res.json({
    daysWorkedThisMonth: daysWorked,
    approvedLeavesThisMonth: approvedLeaves.length
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

  res.json({
    absentToday
  });
};
