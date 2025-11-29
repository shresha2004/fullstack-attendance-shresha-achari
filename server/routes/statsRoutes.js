import express from 'express';
import { protect, requireRole } from '../middleware/authMiddleware.js';
import { getEmployeeStats, getAdminStats } from '../controllers/statsController.js';

const router = express.Router();

router.get('/me', protect, getEmployeeStats);
router.get('/admin', protect, requireRole('admin'), getAdminStats);

export default router;
