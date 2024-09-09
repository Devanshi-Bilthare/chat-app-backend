const express = require('express');
const { sendMessage, getGroupMessages, getOneToOneMessages, markMessagesAsRead, getUnreadMessages } = require('../controllers/messageControllers');
const { protect } = require('../middlewares/authMiddleware');
const attachSocket = require('../middlewares/socketioMiddleware');
const initSocketIo = require('../config/socketIoConfig');


const router = express.Router();

const io = initSocketIo();
router.use(attachSocket(io));

router.post('/', protect, sendMessage);
router.get('/group/:chatRoomId', protect, getGroupMessages);
router.get('/oneToOne/:receiverId', protect, getOneToOneMessages);
router.post('/markMsgRead', protect, markMessagesAsRead);
router.get('/unread', protect, getUnreadMessages);





module.exports = router;
