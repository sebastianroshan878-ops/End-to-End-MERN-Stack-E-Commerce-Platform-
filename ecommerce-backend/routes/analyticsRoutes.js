const express = require('express');
const router = express.Router();
const {
  getRecommendations,
  getProductRecommendations,
  getRapidMinerInsights,
} = require('../controllers/analyticsController');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Optional auth middleware for recommendations (if token provided, enrich with user history)
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecret_mern_jwt_key_2026_secure'
      );
      req.user = await User.findById(decoded.id).select('-password');
    } catch {
      // Ignore token failure for optional recommendation personalization
    }
  }
  next();
};

router.get('/recommendations', optionalAuth, getRecommendations);
router.get('/recommendations/:productId', getProductRecommendations);
router.get('/rapidminer-model', getRapidMinerInsights);

module.exports = router;
