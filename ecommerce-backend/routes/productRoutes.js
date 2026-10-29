const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getTopRatedProducts,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public category and top rated routes (must be placed before /:id)
router.get('/categories/all', getCategories);
router.get('/top/rated', getTopRatedProducts);

// Products CRUD
router
  .route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
