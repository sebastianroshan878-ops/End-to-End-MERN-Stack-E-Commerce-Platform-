const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUserByAdmin,
  deleteUser,
} = require('../controllers/userProfile');
const { protect, admin } = require('../middleware/authMiddleware');

// User profile routes
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin user management routes
router
  .route('/')
  .get(protect, admin, getAllUsers);

router
  .route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUserByAdmin)
  .delete(protect, admin, deleteUser);

module.exports = router;
