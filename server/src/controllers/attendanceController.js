import Attendance from '../models/Attendance.js';

const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

export const clockIn = async (req, res) => {
  const userId = req.user._id;
  const today = getStartOfDay();

  const existing = await Attendance.findOne({
    user: userId,
    date: today,
    clockOutTime: { $exists: false }
  });

  if (existing) {
    return res.status(400).json({ message: 'Already clocked in' });
  }

  // create or update today record
  let attendance = await Attendance.findOne({ user: userId, date: today });
  if (!attendance) {
    attendance = await Attendance.create({
      user: userId,
      date: today,
      clockInTime: new Date()
    });
  } else {
    if (attendance.clockInTime) {
      return res.status(400).json({ message: 'Already clocked in today' });
    }
    attendance.clockInTime = new Date();
    await attendance.save();
  }

  res.status(201).json(attendance);
};

export const clockOut = async (req, res) => {
  const userId = req.user._id;
  const today = getStartOfDay();

  const attendance = await Attendance.findOne({
    user: userId,
    date: today,
    clockInTime: { $exists: true },
    clockOutTime: { $exists: false }
  });

  if (!attendance) {
    return res.status(400).json({ message: 'No open clock-in found' });
  }

  attendance.clockOutTime = new Date();
  await attendance.save();

  res.json(attendance);
};

// Employee: own logs; Admin: filter
export const getMyAttendance = async (req, res) => {
  const { month, year } = req.query;
  const filter = { user: req.user._id };

  if (month && year) {
    const m = Number(month) - 1;
    const y = Number(year);
    const start = new Date(Date.UTC(y, m, 1));
    const end = new Date(Date.UTC(y, m + 1, 1));
    filter.date = { $gte: start, $lt: end };
  }

  const logs = await Attendance.find(filter).sort({ date: -1 });
  res.json(logs);
};

export const getAllAttendance = async (req, res) => {
  const { userId, month, year } = req.query;
  const filter = {};
  if (userId) filter.user = userId;

  if (month && year) {
    const m = Number(month) - 1;
    const y = Number(year);
    const start = new Date(Date.UTC(y, m, 1));
    const end = new Date(Date.UTC(y, m + 1, 1));
    filter.date = { $gte: start, $lt: end };
  }

  const logs = await Attendance.find(filter)
    .populate('user', 'email role')
    .sort({ date: -1 });

  res.json(logs);
};
