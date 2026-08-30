import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';

// @desc    Get dashboard metrics & status summary
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date();
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [totalProducts, totalCustomers, totalOrders, totalCoupons, lowStockProducts, recentOrders] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments(),
      Coupon.countDocuments(),
      Product.find({ stock: { $lte: 5 } }).limit(5).populate('category', 'name'),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
    ]);

    // Aggregate sales/revenue
    const salesTotalAggregate = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = salesTotalAggregate[0]?.totalSales || 0;

    // Sales today
    const salesTodayAggregate = await Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: today } } },
      { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
    ]);
    const salesToday = salesTodayAggregate[0]?.totalSales || 0;

    // Sales this week
    const salesWeekAggregate = await Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: startOfWeek } } },
      { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
    ]);
    const salesWeekly = salesWeekAggregate[0]?.totalSales || 0;

    // Sales this month
    const salesMonthAggregate = await Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
    ]);
    const salesMonthly = salesMonthAggregate[0]?.totalSales || 0;

    // Top selling products based on orders
    const topProductsAggregate = await Order.aggregate([
      { $unwind: '$orderItems' },
      { $group: { _id: '$orderItems.product', name: { $first: '$orderItems.name' }, totalSold: { $sum: '$orderItems.quantity' } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    // Order status counters
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const orderStats = statusCounts.reduce((acc, current) => {
      acc[current._id] = current.count;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        stats: {
          totalRevenue,
          salesToday,
          salesWeekly,
          salesMonthly,
          totalOrders,
          totalCustomers,
          totalProducts,
          totalCoupons,
        },
        orderStats,
        lowStockProducts,
        recentOrders,
        topProducts: topProductsAggregate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get data for charts (revenue over time)
// @route   GET /api/admin/dashboard/charts
// @access  Private/Admin
export const getDashboardCharts = async (req, res, next) => {
  try {
    // Sales over the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const revenueOverTime = await Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        revenueOverTime,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private/Admin
export const getCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password -refreshToken')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Block or Unblock a customer
// @route   PUT /api/admin/customers/:id/block
// @access  Private/Admin
export const toggleBlockCustomer = async (req, res, next) => {
  try {
    const { isBlocked } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot block administrative users' });
    }

    user.isBlocked = isBlocked;
    // Clear refresh token if blocked so they are immediately signed out
    if (isBlocked) {
      user.refreshToken = undefined;
    }
    await user.save();

    res.json({
      success: true,
      message: `Customer account successfully ${isBlocked ? 'blocked' : 'unblocked'}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer order history (Admin view)
// @route   GET /api/admin/customers/:id/orders
// @access  Private/Admin
export const getCustomerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.params.id })
      .populate('orderItems.product')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};
