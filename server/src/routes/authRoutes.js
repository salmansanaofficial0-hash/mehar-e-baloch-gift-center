import express from 'express';
import { body } from 'express-validator';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerificationCode,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters'),
  ],
  registerUser
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  loginUser
);

router.post('/verify-email', verifyEmail);
router.post('/resend-code', resendVerificationCode);
router.post('/refresh', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
