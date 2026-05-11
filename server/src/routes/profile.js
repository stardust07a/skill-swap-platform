const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getMyProfile,
  updateMyProfile,
  getUserById,
  addSkill,
  removeSkill,
} = require('../controllers/profileController');

router.get('/me', authenticate, getMyProfile);
router.put('/me', authenticate, updateMyProfile);
router.post('/skills', authenticate, addSkill);
router.delete('/skills/:id', authenticate, removeSkill);

module.exports = router;
