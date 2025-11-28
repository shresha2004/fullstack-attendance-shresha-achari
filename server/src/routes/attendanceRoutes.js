import express from 'express';
import {
  clockIn,
  clockOut,
  getMyAttendance,
  getAllAttendance
} from '../controllers/attendanceController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/clock-in', protect, clockIn);
router.post('/clock-out', protect, clockOut);

// employee
router.get('/me', protect, getMyAttendance);

// admin
router.get('/', protect, requireRole('admin'), getAllAttendance);

export default router;
