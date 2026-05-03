// routes/authRoutes.ts
import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';

const router = Router();

// These routes do NOT need requireAuth because people need to access them to log in!
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;