const Notification = require('../models/Notification');
const Message = require('../models/Message');
const Chat = require('../models/Chat');

const sendMessage = async (req, res) => {
  const { senderId, chatId, content, io } = req.body;

  const message = new Message({ chatId, sender: senderId, content });
  await message.save();

  const chat = await Chat.findById(chatId);
  const usersToNotify = chat.users.filter((user) => user.toString() !== senderId.toString());

  await Promise.all(
    usersToNotify.map(async (userId) => {
      const notification = await Notification.findOne({ userId, chatId });
      if (notification) {
        notification.unreadCount += 1;
        await notification.save();
      } else {
        await Notification.create({ userId, chatId, unreadCount: 1 });
      }
      io.emit('messageNotification', { chatId, userId });
    })
  );

  res.status(200).json({ message: 'Message sent', message });
};

module.exports = { sendMessage };