import Coupon from '../models/Coupon.js';

// @desc    Validate coupon code
// @route   GET /api/coupons/validate/:code
// @access  Public
export const validateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase() });

    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon' });
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }

    res.json({
      success: true,
      message: 'Coupon is valid',
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons/admin/all
// @access  Private/Admin
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a coupon (Admin)
// @route   POST /api/coupons/admin/create
// @access  Private/Admin
export const createCoupon = async (req, res, next) => {
  try {
    const { code, type, value, minOrderAmount, expiryDate, usageLimit, isActive } = req.body;

    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      type,
      value: Number(value),
      minOrderAmount: Number(minOrderAmount || 0),
      expiryDate,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a coupon (Admin)
// @route   PUT /api/coupons/admin/:id
// @access  Private/Admin
export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    const { code, type, value, minOrderAmount, expiryDate, usageLimit, isActive } = req.body;

    coupon.code = code ? code.toUpperCase() : coupon.code;
    coupon.type = type || coupon.type;
    coupon.value = value !== undefined ? Number(value) : coupon.value;
    coupon.minOrderAmount = minOrderAmount !== undefined ? Number(minOrderAmount) : coupon.minOrderAmount;
    coupon.expiryDate = expiryDate !== undefined ? expiryDate : coupon.expiryDate;
    coupon.usageLimit = usageLimit !== undefined ? Number(usageLimit) : coupon.usageLimit;
    coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;

    await coupon.save();

    res.json({
      success: true,
      message: 'Coupon updated successfully',
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a coupon (Admin)
// @route   DELETE /api/coupons/admin/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    await coupon.deleteOne();

    res.json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
