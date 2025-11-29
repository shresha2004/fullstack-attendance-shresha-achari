import express from 'express';
import { getDebug } from '../controllers/debugController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, getDebug);

export default router;
