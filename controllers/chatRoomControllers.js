const mongoose = require('mongoose');
const ChatRoom = require('../models/ChatRoomModel');
const User = require('../models/UserModel'); // Import the User model
// Create a new chat room
const createChatRoom = async (req, res) => {
    try {
        const { name, members } = req.body; // Get chat room name and initial members from the request body

        // Create a new chat room document
        const chatRoom = new ChatRoom({
            name,
            members: [req.user.id, ...members] // Add the creator to the members list
        });

        // Save the chat room to the database
        await chatRoom.save();

        // Respond with the created chat room
        res.status(201).json(chatRoom);
    } catch (error) {
        console.error('Error creating chat room:', error);
        res.status(500).json({ message: 'Failed to create chat room', error });
    }
};

// Get a chat room by ID
const getChatRoom = async (req, res) => {
    try {
        const { id } = req.params; // Get chat room ID from the request parameters

        // Find the chat room by ID and populate members and messages
        const chatRoom = await ChatRoom.findById(id)
            .populate('members', 'username') // Populate member details (adjust field names as needed)
            .populate('messages'); // Populate messages

        if (!chatRoom) {
            return res.status(404).json({ message: 'Chat room not found' });
        }

        // Respond with the chat room details
        res.status(200).json(chatRoom);
    } catch (error) {
        console.error('Error getting chat room:', error);
        res.status(500).json({ message: 'Failed to get chat room', error });
    }
};


const getUserRooms = async (req, res) => {
    try {
        const { userId } = req.params; // Get user ID from the request parameters

        // Validate userId
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Find chat rooms where the userId is present in the members array
        const chatRooms = await ChatRoom.find({ members: userId })
            .populate('members', 'username') // Populate members with their username
            .populate('messages'); // Populate messages if needed

        // Respond with the list of chat rooms
        res.status(200).json(chatRooms);
    } catch (error) {
        console.error('Error getting chat rooms:', error);
        res.status(500).json({ message: 'Failed to get chat rooms', error });
    }
};

// Update chat room members
const updateMembers = async (req, res) => {
    try {
        const { id } = req.params; // Get chat room ID from the request parameters
        const { members } = req.body; // Get the list of members to be added/removed

        // Find the chat room by ID and update the members list
        const chatRoom = await ChatRoom.findByIdAndUpdate(
            id,
            { members },
            { new: true } // Return the updated document
        ).populate('members', 'username'); // Populate updated members

        if (!chatRoom) {
            return res.status(404).json({ message: 'Chat room not found' });
        }

        // Respond with the updated chat room
        res.status(200).json(chatRoom);
    } catch (error) {
        console.error('Error updating chat room members:', error);
        res.status(500).json({ message: 'Failed to update chat room members', error });
    }
};



module.exports = {
    createChatRoom,
    getChatRoom,
    updateMembers,
    getUserRooms
};
