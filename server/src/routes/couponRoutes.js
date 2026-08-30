import express from 'express';
import { body } from 'express-validator';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  validateCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController.js';

const router = express.Router();

// Public
router.get('/validate/:code', validateCoupon);

// Admin
router.get('/admin/all', protect, adminOnly, getCoupons);
router.post(
  '/admin/create',
  protect,
  adminOnly,
  [
    body('code').notEmpty().withMessage('Code is required'),
    body('type').isIn(['percentage', 'fixed']).withMessage('Type must be percentage or fixed'),
    body('value').isNumeric().withMessage('Value must be a number'),
  ],
  createCoupon
);
router.put('/admin/:id', protect, adminOnly, updateCoupon);
router.delete('/admin/:id', protect, adminOnly, deleteCoupon);

export default router;
