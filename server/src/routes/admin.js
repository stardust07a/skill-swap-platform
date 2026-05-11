const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getStats, getUsers } = require('../controllers/adminController');

router.get('/stats', authenticate, requireAdmin, getStats);
router.get('/users', authenticate, requireAdmin, getUsers);

module.exports = router;
