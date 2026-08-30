import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cartController.js';
import {
  getWishlist,
  toggleWishlist,
} from '../controllers/wishlistController.js';

const router = express.Router();

router.use(protect);

// Cart
router.get('/cart', getCart);
router.post('/cart', addToCart);
router.put('/cart', updateCartItem);
router.delete('/cart', removeCartItem);
router.post('/cart/clear', clearCart);

// Wishlist
router.get('/wishlist', getWishlist);
router.post('/wishlist', toggleWishlist);

export default router;
