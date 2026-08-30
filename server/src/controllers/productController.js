import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

// @desc    Get all products (with pagination, filtering & sorting)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, sort, featured, status, page = 1, limit = 12 } = req.query;

    const query = {};

    // Customer should only see active products
    if (req.user && req.user.role === 'admin') {
      if (status) query.status = status;
    } else {
      query.status = 'active';
    }

    if (category && category !== 'all') {
      // Find sub-categories of this category if it exists
      const subcategories = await Category.find({ parentCategory: category });
      const catIds = [category, ...subcategories.map(c => c._id)];
      query.category = { $in: catIds };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortQuery = { createdAt: -1 }; // newest default
    if (sort === 'price-low') sortQuery = { price: 1 };
    if (sort === 'price-high') sortQuery = { price: -1 };
    if (sort === 'popular') sortQuery = { rating: -1 };
    if (sort === 'name') sortQuery = { name: 1 };

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .populate('category')
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product by ID
// @route   GET /api/products/id/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, comparePrice, discountPrice, stock, category, sku, tags, featured, bestSeller, variants, status } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const productExists = await Product.findOne({ slug });
    if (productExists) {
      return res.status(400).json({ success: false, message: 'Product name or slug already exists' });
    }

    // Process images if uploaded
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.path);
        imageUrls.push(url);
      }
    }

    // Parse variants if they come as string JSON (multer upload sends body strings)
    let parsedVariants = variants;
    if (typeof variants === 'string') {
      try {
        parsedVariants = JSON.parse(variants);
      } catch (err) {
        parsedVariants = [];
      }
    }

    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = tags.split(',').map(tag => tag.trim());
    }

    const product = await Product.create({
      name,
      slug,
      description,
      price: Number(price),
      comparePrice: comparePrice ? Number(comparePrice) : undefined,
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      stock: Number(stock || 0),
      category,
      sku,
      tags: parsedTags || [],
      featured: featured === 'true' || featured === true,
      bestSeller: bestSeller === 'true' || bestSeller === true,
      images: imageUrls,
      variants: parsedVariants || [],
      status: status || 'active',
    });

    res.status(201).json({ success: true, message: 'Product created successfully', data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { name, description, price, comparePrice, discountPrice, stock, category, sku, tags, featured, bestSeller, variants, status, removeImages } = req.body;

    // Process new images
    const imageUrls = [...(product.images || [])];

    // Remove selected images if specified
    let parsedRemoveImages = removeImages;
    if (typeof removeImages === 'string') {
      try {
        parsedRemoveImages = JSON.parse(removeImages);
      } catch (err) {
        parsedRemoveImages = [];
      }
    }

    if (parsedRemoveImages && parsedRemoveImages.length > 0) {
      parsedRemoveImages.forEach(imgUrl => {
        const index = imageUrls.indexOf(imgUrl);
        if (index > -1) {
          imageUrls.splice(index, 1);
        }
      });
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.path);
        imageUrls.push(url);
      }
    }

    let parsedVariants = variants;
    if (typeof variants === 'string') {
      try {
        parsedVariants = JSON.parse(variants);
      } catch (err) {
        parsedVariants = product.variants;
      }
    }

    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = tags.split(',').map(tag => tag.trim());
    }

    product.name = name || product.name;
    if (name) {
      product.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    product.description = description || product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.comparePrice = comparePrice !== undefined ? Number(comparePrice) : product.comparePrice;
    product.discountPrice = discountPrice !== undefined ? Number(discountPrice) : product.discountPrice;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.category = category || product.category;
    product.sku = sku || product.sku;
    product.tags = parsedTags || product.tags;
    product.featured = featured !== undefined ? (featured === 'true' || featured === true) : product.featured;
    product.bestSeller = bestSeller !== undefined ? (bestSeller === 'true' || bestSeller === true) : product.bestSeller;
    product.images = imageUrls;
    product.variants = parsedVariants || product.variants;
    product.status = status || product.status;

    const updatedProduct = await product.save();
    res.json({ success: true, message: 'Product updated successfully', data: updatedProduct });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk Update Products (Enable/Disable status)
// @route   PUT /api/products/bulk/status
// @access  Private/Admin
export const bulkUpdateStatus = async (req, res, next) => {
  try {
    const { ids, status } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Array of Product IDs is required' });
    }

    if (!['active', 'draft'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    await Product.updateMany({ _id: { $in: ids } }, { status });

    res.json({ success: true, message: `Successfully updated ${ids.length} products to ${status}` });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk Delete Products
// @route   POST /api/products/bulk/delete
// @access  Private/Admin
export const bulkDeleteProducts = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Array of Product IDs is required' });
    }

    await Product.deleteMany({ _id: { $in: ids } });

    res.json({ success: true, message: `Successfully deleted ${ids.length} products` });
  } catch (error) {
    next(error);
  }
};

// @desc    Get low stock products alert list
// @route   GET /api/products/alerts/low-stock
// @access  Private/Admin
export const getLowStockProducts = async (req, res, next) => {
  try {
    const threshold = Number(req.query.threshold || 5);
    const products = await Product.find({ stock: { $lte: threshold } }).populate('category');

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
