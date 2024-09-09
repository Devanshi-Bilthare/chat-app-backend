const express = require('express');
const { createChatRoom, getChatRoom, updateMembers,getUserRooms } = require('../controllers/chatRoomControllers');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, createChatRoom);
router.get('/:id', protect, getChatRoom);
router.put('/:id/members', protect, updateMembers);
router.get('/:userId/userroom',protect,getUserRooms)

module.exports = router;
