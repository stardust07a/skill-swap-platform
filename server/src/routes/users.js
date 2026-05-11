const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getUserById } = require('../controllers/profileController');

router.get('/:id', authenticate, getUserById);

module.exports = router;
