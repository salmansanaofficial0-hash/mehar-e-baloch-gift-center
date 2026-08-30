import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, selectedVariant } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check if product with this variant already exists in cart
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        (!selectedVariant || item.selectedVariant === selectedVariant)
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        quantity: Number(quantity),
        selectedVariant,
      });
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.product');

    res.json({
      success: true,
      message: 'Item added to cart',
      data: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart
// @access  Private
export const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity, selectedVariant } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        (!selectedVariant || item.selectedVariant === selectedVariant)
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = Number(quantity);
      await cart.save();
      const populatedCart = await Cart.findById(cart._id).populate('items.product');
      return res.json({ success: true, message: 'Cart updated', data: populatedCart });
    } else {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart
// @access  Private
export const removeCartItem = async (req, res, next) => {
  try {
    const { productId, selectedVariant } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) =>
        !(item.product.toString() === productId &&
          (!selectedVariant || item.selectedVariant === selectedVariant))
    );

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.product');

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   POST /api/cart/clear
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};
