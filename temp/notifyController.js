const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  const { userId } = req.params;
  const notifications = await Notification.find({ userId });
  res.status(200).json(notifications);
};

const resetNotification = async (req, res) => {
  const { userId, chatId } = req.body;
  await Notification.findOneAndUpdate({ userId, chatId }, { unreadCount: 0 });
  res.status(200).json({ message: 'Notifications reset' });
};

module.exports = { getNotifications, resetNotification };