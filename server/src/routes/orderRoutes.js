import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  getOrderInvoice,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = express.Router();

router.use(protect);

// Customer routes
router.get('/customer/my-orders', getMyOrders);
router.get('/customer/:id', getOrderById);
router.get('/:id/invoice', getOrderInvoice);
router.post('/', placeOrder);

// Admin routes
router.get('/admin/all', getAllOrders);
router.put('/admin/:id/status', updateOrderStatus);

export default router;
