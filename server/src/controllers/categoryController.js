import Category from '../models/Category.js';
import Product from '../models/Product.js';

// @desc    Get all categories (hierarchical structure)
// @route   GET /api/products/categories/all
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate('parentCategory');

    // Build hierarchy if needed by client, or just return flat list
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category or subcategory
// @route   POST /api/admin/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, parentCategory } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      parentCategory: parentCategory || null,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, image, parentCategory } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    category.name = name || category.name;
    if (name) {
      category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    category.description = description !== undefined ? description : category.description;
    category.image = image !== undefined ? image : category.image;
    category.parentCategory = parentCategory !== undefined ? (parentCategory || null) : category.parentCategory;

    const updated = await category.save();
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if category is used in products
    const productsCount = await Product.countDocuments({ category: category._id });
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It is linked to ${productsCount} products.`,
      });
    }

    await category.deleteOne();
    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
