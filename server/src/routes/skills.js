const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getAllSkills, createSkill } = require('../controllers/skillController');

router.get('/', getAllSkills);
router.post('/', authenticate, createSkill);

module.exports = router;
