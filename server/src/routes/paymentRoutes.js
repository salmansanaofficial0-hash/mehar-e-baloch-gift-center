import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { createCheckoutSession, handleStripeWebhook } from '../controllers/paymentController.js';

const router = express.Router();

// Stripe webhook needs raw body (must be mounted before express.json in server.js)
router.post('/webhook', handleStripeWebhook);

// Authenticated Routes
router.post('/create-checkout-session', protect, createCheckoutSession);

export default router;
