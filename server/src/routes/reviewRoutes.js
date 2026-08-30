import express from 'express';
import { body } from 'express-validator';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  getProductReviews,
  submitReview,
  getAllReviews,
  approveReview,
  deleteReview,
} from '../controllers/reviewController.js';

const router = express.Router();

// Public
router.get('/product/:productId', getProductReviews);

// Authenticated customer
router.post(
  '/',
  protect,
  [
    body('product').notEmpty().withMessage('Product ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').notEmpty().withMessage('Comment is required'),
  ],
  submitReview
);

// Admin
router.get('/admin/all', protect, adminOnly, getAllReviews);
router.put('/admin/:id/approve', protect, adminOnly, approveReview);
router.delete('/admin/:id', protect, adminOnly, deleteReview);

export default router;
