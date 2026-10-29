const Product = require('../models/product');

// @desc    Fetch all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter query
    const filter = {};

    // 1. Keyword search (Name, Description, Brand)
    if (req.query.keyword) {
      filter.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
        { brand: { $regex: req.query.keyword, $options: 'i' } },
      ];
    }

    // 2. Category filter
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }

    // 3. Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    // 4. In-stock filter
    if (req.query.inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    // 5. Featured filter
    if (req.query.featured === 'true') {
      filter.featured = true;
    }

    // Sorting
    let sort = { createdAt: -1 }; // Default: Newest first
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'price-asc':
          sort = { price: 1 };
          break;
        case 'price-desc':
          sort = { price: -1 };
          break;
        case 'rating-desc':
          sort = { rating: -1 };
          break;
        case 'oldest':
          sort = { createdAt: 1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }

    const totalCount = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: products.length,
      totalCount,
      page,
      pages: Math.ceil(totalCount / limit) || 1,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      price,
      description,
      image,
      brand,
      category,
      stock,
      featured,
      tags,
    } = req.body;

    if (!name || price === undefined || !description || !image || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required product fields: name, price, description, image, brand, category',
      });
    }

    const product = new Product({
      name,
      price: Number(price),
      description,
      image,
      brand,
      category,
      stock: stock !== undefined ? Number(stock) : 10,
      featured: Boolean(featured),
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : []),
      rating: 4.8,
      numReviews: 1,
    });

    const createdProduct = await product.save();
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: createdProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const {
      name,
      price,
      description,
      image,
      brand,
      category,
      stock,
      featured,
      tags,
      rating,
    } = req.body;

    product.name = name || product.name;
    product.price = price !== undefined ? Number(price) : product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.featured = featured !== undefined ? Boolean(featured) : product.featured;
    if (rating !== undefined) product.rating = Number(rating);
    if (tags !== undefined) {
      product.tags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim());
    }

    const updatedProduct = await product.save();
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all distinct categories
// @route   GET /api/products/categories/all
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top rated/featured products
// @route   GET /api/products/top/rated
// @access  Public
const getTopRatedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ rating: -1, numReviews: -1 }).limit(6);
    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getTopRatedProducts,
};
