import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  getDashboardStats,
  getDashboardCharts,
  getCustomers,
  toggleBlockCustomer,
  getCustomerOrders,
} from '../controllers/adminController.js';
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';

const router = express.Router();

// All admin routes require auth + adminOnly
router.use(protect, adminOnly);

// Dashboard
router.get('/dashboard', getDashboardStats);
router.get('/dashboard/charts', getDashboardCharts);

// Category CRUD
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Customer Management
router.get('/customers', getCustomers);
router.put('/customers/:id/block', toggleBlockCustomer);
router.get('/customers/:id/orders', getCustomerOrders);

export default router;
