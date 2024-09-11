const { Server } = require('socket.io');

// In-memory store to track online users
const onlineUsers = {};

const initSocketIo = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        // Store the user's ID and socket ID
        socket.on('setUserId', (userId) => {
            onlineUsers[userId] = socket.id;
            console.log(`User ID ${userId} connected with socket ID ${socket.id}`);
        });

        // Join a room
        socket.on('joinRoom', (room) => {
            socket.join(room);
            console.log(`User joined room: ${room}`);
        });

        // Handle message sending
        socket.on('sendMessage', (message) => {
            // console.log(message)
            if (message.room) {
                io.to(message.room).emit('receiveMessage', message);
            } else {
                // Send message to the receiver
                console.log(message)
                io.to(message.receiver).emit('receiveMessage', message);
                console.log(`Message sent to receiver: ${message.receiver}`);            
            }
        });

        // Handle user disconnect
        socket.on('disconnect', () => {
            // Remove the user from the online users store
            for (const [userId, socketId] of Object.entries(onlineUsers)) {
                if (socketId === socket.id) {
                    delete onlineUsers[userId];
                    console.log(`User ID ${userId} disconnected`);
                    break;
                }
            }
        });
    });

    return io;
};

module.exports = initSocketIo;
