import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Coupon from '../models/Coupon.js';
import { generateInvoicePDF } from '../utils/pdfGenerator.js';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
export const placeOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, couponCode } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    // Verify stock availability
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Product ${product ? product.name : 'Unknown'} has insufficient stock. Only ${product ? product.stock : 0} items available.`,
        });
      }
    }

    // Calculate items price
    const itemsPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Apply Coupon if exists
    let shippingPrice = 150; // Flat shipping rate
    let taxPrice = Math.round(itemsPrice * 0.05); // 5% tax
    let discount = 0;
    let couponId = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && (!coupon.expiryDate || coupon.expiryDate > new Date())) {
        if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
          if (itemsPrice >= coupon.minOrderAmount) {
            discount = coupon.type === 'percentage'
              ? Math.round(itemsPrice * (coupon.value / 100))
              : coupon.value;
            couponId = coupon._id;
            coupon.usedCount += 1;
            await coupon.save();
          }
        }
      }
    }

    const totalPrice = itemsPrice + shippingPrice + taxPrice - discount;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      orderItems: cart.items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice: totalPrice < 0 ? 0 : totalPrice,
      coupon: couponId,
      status: 'pending',
    });

    // Deduct inventory stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear user's cart
    cart.items = [];
    await cart.save();

    // Send confirmation email
    await sendOrderConfirmationEmail(req.user.email, req.user.name, order);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/customer/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
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

// @desc    Get order by ID
// @route   GET /api/orders/customer/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Authorization check: Admin can access any order, Customer can only access their own
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate Invoice PDF for an order
// @route   GET /api/orders/:id/invoice
// @access  Private
export const getOrderInvoice = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to access invoice' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);

    generateInvoicePDF(order, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, customer, dateFrom, dateTo, page = 1, limit = 10 } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (customer) {
      query.user = customer;
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('orderItems.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/admin/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;

    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
