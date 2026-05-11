const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getUserReviews, createReview } = require('../controllers/reviewController');

router.get('/users/:id/reviews', authenticate, getUserReviews);
router.post('/', authenticate, createReview);

module.exports = router;
