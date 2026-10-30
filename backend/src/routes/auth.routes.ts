import { Router } from 'express';
import { register, login, getMe, getDemoUsers } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.get('/demo-users', getDemoUsers);

export default router;
