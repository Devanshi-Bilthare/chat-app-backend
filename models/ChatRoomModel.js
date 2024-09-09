const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  members: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }
  ],
  messages: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Message' 
    }
  ],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
