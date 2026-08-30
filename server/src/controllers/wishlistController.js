import User from '../models/User.js';

// @desc    Get user's wishlist
// @route   GET /api/users/profile/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');

    res.json({
      success: true,
      data: user.wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle product in wishlist (Add/Remove)
// @route   POST /api/users/profile/wishlist
// @access  Private
export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    const isAlreadyWishlisted = user.wishlist.includes(productId);

    if (isAlreadyWishlisted) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
      await user.save();
      res.json({
        success: true,
        message: 'Product removed from wishlist',
        data: user.wishlist,
      });
    } else {
      user.wishlist.push(productId);
      await user.save();
      res.json({
        success: true,
        message: 'Product added to wishlist',
        data: user.wishlist,
      });
    }
  } catch (error) {
    next(error);
  }
};
