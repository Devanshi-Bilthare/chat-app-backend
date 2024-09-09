const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: { 
    type: String 
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    // required: true 
  },
  chatRoom: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ChatRoom', 
    default: null 
  },
  fileUrl: { 
    type: String 
  },
  fileType: { 
    type: String 
  },
  originalFileName: { 
    type: String 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  read: { 
    type: Boolean, 
    default: false 
  },
});

module.exports = mongoose.model('Message', messageSchema);
