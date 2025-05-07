const express = require('express');
const router = express.Router();
const {
  subscribeNewsletter,
  getSubscriptionStatus,
  getAllSubscribers
} = require('./newsletter.controller');
const { authMiddleware, adminAuthMiddleware } = require('../Middleware/authMiddleware');



// Only authenticated users can subscribe/unsubscribe
router.post('/subscribe', authMiddleware, subscribeNewsletter);

// Get status (optional: keep public or protect)
router.get('/status', authMiddleware, getSubscriptionStatus);

// Only admins can get all subscribers
router.get('/all-subscribers', authMiddleware, adminAuthMiddleware, getAllSubscribers);

module.exports = router;
