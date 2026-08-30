import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Get all approved reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a review
// @route   POST /api/reviews
// @access  Private
export const submitReview = async (req, res, next) => {
  try {
    const { product: productId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Verify if customer has purchased the product
    const orders = await Order.find({
      user: req.user._id,
      status: 'delivered',
      'orderItems.product': productId,
    });

    if (orders.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'You can only review products you have purchased and received.',
      });
    }

    // Check if review already exists
    const reviewExists = await Review.findOne({ user: req.user._id, product: productId });
    if (reviewExists) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product.' });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      name: req.user.name,
      rating: Number(rating),
      comment,
      isApproved: false, // Moderated by default
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted. It is pending admin approval.',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews/admin/all
// @access  Private/Admin
export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('product', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/moderate review (Admin)
// @route   PUT /api/reviews/admin/:id/approve
// @access  Private/Admin
export const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.isApproved = true;
    await review.save();

    // Recalculate average rating for product
    const reviews = await Review.find({ product: review.product, isApproved: true });
    const numReviews = reviews.length;
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / numReviews;

    // Save average rating and push review object to Product schema
    const product = await Product.findById(review.product);
    if (product) {
      product.rating = avgRating;
      product.numReviews = numReviews;

      // Add to internal subdocument array if not exists
      const reviewSubdocIndex = product.reviews.findIndex(r => r.user.toString() === review.user.toString());
      if (reviewSubdocIndex > -1) {
        product.reviews[reviewSubdocIndex].isApproved = true;
      } else {
        product.reviews.push({
          user: review.user,
          name: review.name,
          rating: review.rating,
          comment: review.comment,
          isApproved: true,
        });
      }
      await product.save();
    }

    res.json({
      success: true,
      message: 'Review approved successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review (Admin)
// @route   DELETE /api/reviews/admin/:id
// @access  Private/Admin
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const productId = review.product;
    await review.deleteOne();

    // Recalculate rating for product
    const reviews = await Review.find({ product: productId, isApproved: true });
    const numReviews = reviews.length;
    const avgRating = numReviews > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / numReviews : 0;

    const product = await Product.findById(productId);
    if (product) {
      product.rating = avgRating;
      product.numReviews = numReviews;
      product.reviews = product.reviews.filter(r => r.user.toString() !== review.user.toString());
      await product.save();
    }

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
