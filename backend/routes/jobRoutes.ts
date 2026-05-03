// routes/jobRoutes.ts
import { Router } from 'express';
// Make sure to import BOTH functions now!
import { createJobListing, getAllJobs } from '../controllers/jobController'; 
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// PUBLIC ROUTE: Anyone can view the job feed (no token required)
router.get('/', getAllJobs); 

// PROTECTED ROUTE: Only logged-in users with a token can post jobs
router.post('/', requireAuth, createJobListing);

export default router;