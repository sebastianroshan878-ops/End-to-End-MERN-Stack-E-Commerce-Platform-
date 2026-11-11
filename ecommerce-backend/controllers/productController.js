const mongoose = require('mongoose');
const Product = require('../models/product');
const seedProducts = require('../data/seedProducts');
const { autoSeedIfEmpty } = require('../utils/autoSeeder');

// Helper: Filter and sort seedProducts in memory as a resilient fallback
const filterInMemoryProducts = (items, query) => {
  let filtered = [...items];

  // 1. Keyword search (Name, Description, Brand)
  if (query.keyword) {
    const kw = query.keyword.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(kw)) ||
        (p.description && p.description.toLowerCase().includes(kw)) ||
        (p.brand && p.brand.toLowerCase().includes(kw))
    );
  }

  // 2. Category filter
  if (query.category && query.category !== 'All') {
    filtered = filtered.filter((p) => p.category === query.category);
  }

  // 3. Price range filter
  if (query.minPrice) {
    filtered = filtered.filter((p) => p.price >= Number(query.minPrice));
  }
  if (query.maxPrice) {
    filtered = filtered.filter((p) => p.price <= Number(query.maxPrice));
  }

  // 4. In-stock filter
  if (query.inStock === 'true') {
    filtered = filtered.filter((p) => p.stock > 0);
  }

  // 5. Featured filter
  if (query.featured === 'true') {
    filtered = filtered.filter((p) => Boolean(p.featured));
  }

  // 6. Sorting
  if (query.sortBy) {
    switch (query.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'oldest':
        // Keep order
        break;
      default:
        // Newest / default
        break;
    }
  }

  return filtered;
};

// @desc    Fetch all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Check if database is active
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        const count = await Product.countDocuments();
        if (count === 0) {
          // Empty DB on cloud / Atlas: auto-seed catalog
          await autoSeedIfEmpty();
        }

        // Build DB filter query
        const filter = {};

        if (req.query.keyword) {
          filter.$or = [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } },
            { brand: { $regex: req.query.keyword, $options: 'i' } },
          ];
        }

        if (req.query.category && req.query.category !== 'All') {
          filter.category = req.query.category;
        }

        if (req.query.minPrice || req.query.maxPrice) {
          filter.price = {};
          if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
          if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
        }

        if (req.query.inStock === 'true') {
          filter.stock = { $gt: 0 };
        }

        if (req.query.featured === 'true') {
          filter.featured = true;
        }

        let sort = { createdAt: -1 };
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

        if (totalCount > 0 || Object.keys(filter).length > 0) {
          return res.json({
            success: true,
            count: products.length,
            totalCount,
            page,
            pages: Math.ceil(totalCount / limit) || 1,
            data: products,
          });
        }
      } catch (dbErr) {
        console.warn('[ProductController] DB query failed, falling back to seed products:', dbErr.message);
      }
    }

    // Resilient Fallback: Database down, empty, or unseeded
    const filtered = filterInMemoryProducts(seedProducts, req.query);
    const paginated = filtered.slice(skip, skip + limit);

    return res.json({
      success: true,
      count: paginated.length,
      totalCount: filtered.length,
      page,
      pages: Math.ceil(filtered.length / limit) || 1,
      data: paginated,
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
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
          const product = await Product.findById(req.params.id);
          if (product) {
            return res.json({
              success: true,
              data: product,
            });
          }
        }
      } catch (err) {
        console.warn('[ProductController] DB lookup error:', err.message);
      }
    }

    // Fallback: In-memory lookup
    const fallbackProduct = seedProducts.find(
      (p) => String(p._id) === String(req.params.id) || p.name.toLowerCase() === req.params.id.toLowerCase()
    );

    if (fallbackProduct) {
      return res.json({
        success: true,
        data: fallbackProduct,
      });
    }

    return res.status(404).json({
      success: false,
      message: 'Product not found',
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
    if (mongoose.connection.readyState === 1) {
      try {
        const categories = await Product.distinct('category');
        if (categories && categories.length > 0) {
          return res.json({
            success: true,
            data: categories,
          });
        }
      } catch (err) {
        console.warn('[ProductController] DB categories lookup error:', err.message);
      }
    }

    // Fallback: Extract categories from seedProducts
    const categories = Array.from(new Set(seedProducts.map((p) => p.category)));
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
    if (mongoose.connection.readyState === 1) {
      try {
        const products = await Product.find({}).sort({ rating: -1, numReviews: -1 }).limit(6);
        if (products && products.length > 0) {
          return res.json({
            success: true,
            data: products,
          });
        }
      } catch (err) {
        console.warn('[ProductController] DB top rated error:', err.message);
      }
    }

    // Fallback: Top rated from seedProducts
    const products = [...seedProducts]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6);

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
