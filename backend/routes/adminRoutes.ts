// routes/adminRoutes.ts
import { Router } from 'express';
import { approveCompany, suspendUser } from '../controllers/adminController';
import { requireAuth } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/rbacMiddleware';

const router = Router();

// Notice the double security check: First they must be logged in, THEN they must be an Admin
router.put('/companies/:company_id/approve', requireAuth, requireAdmin, approveCompany);
router.put('/users/:user_id/suspend', requireAuth, requireAdmin, suspendUser);

export default router;