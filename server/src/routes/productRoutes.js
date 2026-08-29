import express from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/categories/all', async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

router.get('/', async (req, res) => {
  const { category, search, sort = 'newest', featured } = req.query;
  const query = {};

  if (category && category !== 'all') query.category = category;
  if (featured === 'true') query.featured = true;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  let sortQuery = { createdAt: -1 };
  if (sort === 'price-low') sortQuery = { price: 1 };
  if (sort === 'price-high') sortQuery = { price: -1 };
  if (sort === 'popular') sortQuery = { rating: -1 };

  const products = await Product.find(query).populate('category').sort(sortQuery);
  res.json(products);
});

router.get('/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('category');
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

router.post(
  '/',
  protect,
  adminOnly,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description, price, category, slug, ...rest } = req.body;
      const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const product = await Product.create({
        name,
        description,
        price,
        category,
        slug: generatedSlug,
        ...rest,
      });
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.put(
  '/:id',
  protect,
  adminOnly,
  async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  }
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  }
);

export default router;
