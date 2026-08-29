import express from 'express';
import { body, validationResult } from 'express-validator';
import Coupon from '../models/Coupon.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Customer routes
router.get('/validate/:code', async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase() });
    if (!coupon || !coupon.isActive || (coupon.expiryDate && coupon.expiryDate < new Date())) {
      return res.status(404).json({ message: 'Invalid or expired coupon' });
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post(
  '/admin/create',
  protect,
  adminOnly,
  [
    body('code').notEmpty().withMessage('Code is required'),
    body('type').isIn(['percentage', 'fixed']).withMessage('Type must be percentage or fixed'),
    body('value').isNumeric().withMessage('Value must be a number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const coupon = await Coupon.create(req.body);
      res.status(201).json(coupon);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.put('/admin/:id', protect, adminOnly, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json(coupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/admin/:id', protect, adminOnly, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
