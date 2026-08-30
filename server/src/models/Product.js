import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true },
    comparePrice: { type: Number },
    discountPrice: { type: Number },
    stock: { type: Number, default: 0 },
    sku: { type: String, index: true },
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    images: [{ type: String }],
    tags: [{ type: String }],
    dimensions: String,
    material: String,
    occasion: String,
    discount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    status: { type: String, enum: ['active', 'draft'], default: 'active', index: true },
    variants: [
      {
        size: String,
        color: String,
        price: Number,
        stock: Number,
        sku: String,
      },
    ],
  },
  { timestamps: true }
);

productSchema.index({ category: 1 });
productSchema.index({ tags: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
