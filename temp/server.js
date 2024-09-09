const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const messageRoutes = require('../routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Create server and socket.io instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust if needed for security
  },
});

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/chat-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  console.log('A user connected');

  // When a user connects
  socket.on('userConnected', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });

  // When a message is sent
  socket.on('sendMessage', ({ senderId, receiverId, message, chatId }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit('getNotification', {
        senderId,
        message,
        chatId,
      });
    }
  });

  // When a user disconnects
  socket.on('disconnect', () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit('getUsers', users);
    console.log('A user disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});