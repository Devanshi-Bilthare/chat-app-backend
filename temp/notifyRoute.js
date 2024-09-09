const express = require('express');
const { getNotifications, resetNotification } = require('../controllers/notificationController');
const router = express.Router();

router.get('/:userId', getNotifications);
router.post('/reset', resetNotification);

module.exports = router;