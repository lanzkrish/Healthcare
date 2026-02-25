/**
 * Notification Routes (protected, admin access preferred)
 */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { sendNotification, sendReminder } = require('../controllers/notificationController');

router.use(protect);

router.post('/send', sendNotification);
router.post('/reminder', sendReminder);

module.exports = router;
