const express = require('express');
const { getAllMessages, getAllUsers } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/messages', protect, admin, getAllMessages);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;
