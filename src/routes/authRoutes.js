import { Router } from 'express';
import { login, logout } from '../controllers/authController.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', login);
router.post('/logout', authMiddleware, logout);

router.get('/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

export default router;
