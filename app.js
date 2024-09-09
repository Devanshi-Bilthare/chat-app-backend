const dotenv = require('dotenv').config('./.env');
const express = require('express');
const http = require('http');
const dbConnect = require('./config/dbConnect');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const initSocketIo = require('./config/socketIoConfig'); // Import the Socket.IO config
const fileUpload = require('express-fileupload');

const app = express();
const server = http.createServer(app); 
const io = initSocketIo(server);

dbConnect();

const userRouter = require('./routes/userRoutes');
const messageRouter = require('./routes/messageRoutes');
const chatRoomRouter = require('./routes/chatRommRoutes')

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');

// Middleware
app.use(fileUpload());
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use('/api/user', userRouter);
app.use('/api/messages', messageRouter);
app.use('/api/chatRoom', chatRoomRouter);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Start server
server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
