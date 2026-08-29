import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Coupon from '../models/Coupon.js';
import CustomGiftRequest from '../models/CustomGiftRequest.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard', async (req, res) => {
  try {
    const [totalProducts, totalCustomers, totalOrders, totalCoupons, pendingRequests, recentOrders, lowStockProducts] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments(),
      Coupon.countDocuments(),
      CustomGiftRequest.countDocuments({ status: 'new' }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email').populate('orderItems.product', 'name'),
      Product.find({ stock: { $lt: 5 } }).limit(5).populate('category', 'name'),
    ]);

    const revenue = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
    ]);

    const orderStats = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const totalSales = revenue[0]?.totalSales || 0;

    res.json({
      message: 'Admin dashboard ready',
      admin: req.user.name,
      stats: {
        totalSales,
        totalOrders,
        totalCustomers,
        totalProducts,
        totalCoupons,
        pendingRequests,
      },
      orderStats: orderStats.reduce((acc, stat) => ({ ...acc, [stat._id]: stat.count }), {}),
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().populate('category').sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/customers', async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/reviews/pending', async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: false }).populate('user', 'name').populate('product', 'name').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
