import express from 'express';
import { body, validationResult } from 'express-validator';
import Review from '../models/Review.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Customer routes
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true }).populate('user', 'name').populate('product', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post(
  '/',
  protect,
  [
    body('product').notEmpty().withMessage('Product ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').notEmpty().withMessage('Comment is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const review = await Review.create({ ...req.body, user: req.user._id, name: req.user.name });
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Admin routes
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const reviews = await Review.find().populate('user', 'name email').populate('product', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/admin/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/admin/:id', protect, adminOnly, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
