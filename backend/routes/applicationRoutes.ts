// routes/applicationRoutes.ts
import { Router } from 'express';
import { applyForJob } from '../controllers/applicationController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Check the token first, then run the application logic
router.post('/', requireAuth, applyForJob);

export default router;