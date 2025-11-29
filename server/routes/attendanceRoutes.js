import express from 'express';
import {
  clockIn,
  clockOut,
  getMyAttendance,
  getAllAttendance,
  getEmployees
} from '../controllers/attendanceController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/clock-in', protect, clockIn);
router.post('/clock-out', protect, clockOut);

router.get('/me', protect, getMyAttendance);

router.get('/employees', protect, requireRole('admin'), getEmployees);
router.get('/', protect, requireRole('admin'), getAllAttendance);

export default router;
