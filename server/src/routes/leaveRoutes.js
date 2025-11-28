import express from 'express';
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
} from '../controllers/leaveController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// employee
router.post('/', protect, applyLeave);
router.get('/me', protect, getMyLeaves);

// admin
router.get('/', protect, requireRole('admin'), getAllLeaves);
router.patch('/:id/status', protect, requireRole('admin'), updateLeaveStatus);

export default router;
