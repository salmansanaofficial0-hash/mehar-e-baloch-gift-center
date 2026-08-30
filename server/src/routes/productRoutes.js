import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import {
  getProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUpdateStatus,
  bulkDeleteProducts,
  getLowStockProducts,
} from '../controllers/productController.js';
import { getCategories } from '../controllers/categoryController.js';

const router = express.Router();

// Public Routes
router.get('/categories/all', getCategories);
router.get('/alerts/low-stock', protect, adminOnly, getLowStockProducts);
router.get('/bulk/status', protect, adminOnly, bulkUpdateStatus);
router.get('/id/:id', getProductById);
router.get('/:slug', getProductBySlug);
router.get('/', getProducts);

// Admin Routes
router.post('/', protect, adminOnly, upload.array('images', 10), createProduct);
router.put('/bulk/status', protect, adminOnly, bulkUpdateStatus);
router.post('/bulk/delete', protect, adminOnly, bulkDeleteProducts);
router.put('/:id', protect, adminOnly, upload.array('images', 10), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
