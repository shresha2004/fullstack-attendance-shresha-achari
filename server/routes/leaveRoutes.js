import express from 'express';
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
} from '../controllers/leaveController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, applyLeave);
router.get('/me', protect, getMyLeaves);

router.get('/', protect, requireRole('admin'), getAllLeaves);
router.patch('/:id/status', protect, requireRole('admin'), updateLeaveStatus);

export default router;
