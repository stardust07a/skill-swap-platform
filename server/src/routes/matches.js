const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getMatches } = require('../controllers/matchController');

router.get('/', authenticate, getMatches);

module.exports = router;
