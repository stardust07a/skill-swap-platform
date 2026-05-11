const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getRequests,
  createRequest,
  updateRequestStatus,
  updateMeetingLink,
} = require('../controllers/requestController');

router.get('/', authenticate, getRequests);
router.post('/', authenticate, createRequest);
router.put('/:id/status', authenticate, updateRequestStatus);
router.put('/:id/meeting-link', authenticate, updateMeetingLink);

module.exports = router;
