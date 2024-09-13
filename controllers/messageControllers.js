
const Message = require('../models/MessageModel');
const imagekit = require('../config/imageKitConfig');
const ChatRoom = require('../models/ChatRoomModel');

const sendMessage = async (req, res) => {
    try {
        const { content, receiverId, room } = req.body; // Include `room` for group chat
        let fileUrl = null;
        let fileType = null;
        let originalFileName = null;

        // Check if a file was uploaded
        if (req.files && req.files.file) {
            const file = req.files.file;
            const fileUploadResponse = await imagekit.upload({
                file: file.data, // File data from express-fileupload
                fileName: file.name,
            });

            fileUrl = fileUploadResponse.url;
            fileType = file.mimetype;
            originalFileName = file.name;
        }

        const message = new Message({
            content,
            sender: req.user.id,
            receiver: room ? null : receiverId, // Set receiver to null for group chats
            chatRoom: room || null, // Set chatRoom for group messages
            fileUrl,
            fileType,
            originalFileName,
            timestamp: new Date(),
        });

        await message.save();
        
        if (room) {
            await ChatRoom.findByIdAndUpdate(room, {
                $push: { messages: message._id }
            });
            // Emit to the specific room for group chat
            req.io.to(room).emit('receiveMessage', message);
        } else if (receiverId) {
            // Emit to the specific receiver for one-to-one chat
            req.io.to(receiverId).emit('receiveMessage', message);
        }

        res.status(201).json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Failed to send message', error });
    }
};


const getGroupMessages = async (req, res) => {
    try {
        const { chatRoomId } = req.params; // Get chatRoomId from route parameters

        // Fetch messages for a specific chat room (group chat)
        const messages = await Message.find({ chatRoom: chatRoomId }).sort({ timestamp: 1 }).populate('sender')

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get group messages', error });
    }
};

const getOneToOneMessages = async (req, res) => {
    try {
        const { receiverId } = req.params; // Get receiverId from route parameters

        // Fetch messages between the logged-in user and a specific receiver (one-to-one chat)
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: receiverId },
                { sender: receiverId, receiver: req.user.id }
            ]
        }).sort({ timestamp: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get one-to-one messages', error });
    }
};


const markMessagesAsRead = async (req, res) => {
    try {
        const { senderId, chatType } = req.body; // Sender ID to mark all messages as read
        console.log("senderId", senderId);

        let msg;

        if (chatType === 'one') {
            // One-on-one chat: mark messages as read
            msg = await Message.updateMany(
                { sender: senderId, receiver: req.user.id },
                { $set: { read: true } }
            );
        } else if (chatType === 'group') {
            // Group chat: add current user to the readBy array
            msg = await Message.updateMany(
                { chatRoom: senderId, readBy: { $ne: req.user.id } }, // Avoid adding user ID multiple times
                { $addToSet: { readBy: req.user.id } } // Add the user to readBy array without duplicates
            );
        }

        res.status(200).json({ msg });
    } catch (error) {
        res.status(500).json({ message: 'Failed to mark messages as read', error });
    }
};

const getUnreadMessages = async (req, res) => {
    try {
        // Query to find all messages where read is false
        const unreadMessages = await Message.find({ read: false })

        // Respond with the list of unread messages
        res.status(200).json(unreadMessages);
    } catch (error) {
        console.error('Error getting unread messages:', error);
        res.status(500).json({ message: 'Failed to get unread messages', error });
    }
};

const getAllMessages = async (req, res) => {
    try {
        // Query to find all messages where read is false
        const allMessages = await Message.find().populate('sender').populate('receiver')

        // Respond with the list of unread messages
        res.status(200).json(allMessages);
    } catch (error) {
        console.error('Error all messages', error);
        res.status(500).json({ message: 'Failed to get messages', error });
    }
};

module.exports = {sendMessage, getGroupMessages, getOneToOneMessages,markMessagesAsRead ,getUnreadMessages,getAllMessages };



