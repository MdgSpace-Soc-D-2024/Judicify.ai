const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const AuthRouter = require('./Routes/AuthRouter');
const RoomRouter = require('./Routes/RoomRouter');
const UploadRouter = require('./Routes/UploadRouter')
const PdfRouter = require('./Routes/PdfRouter')
require('dotenv').config();
require('./Models/db');
const Message = require('./Models/RMessages')
const app = express();
const PORT = process.env.PORT || 1818;


app.use(fileUpload());
app.use(bodyParser.json());

//HTTP server and Socket.IO 
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'], 
    credentials: true,
  },
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Routes
app.use('/auth', AuthRouter);
app.use('/rooms', RoomRouter(io)); // Pass `io` as an argument to RoomRouter
app.use('/upload_pdf', UploadRouter)
app.use('/get_pdf', PdfRouter)

// Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
    io.to(roomId).emit('user-joined', `A new user has joined room ${roomId}`);
  });

  socket.on('send-message', async ({ roomId, message, sender }) => {
    try {
      const newMessage = new Message({ roomId, sender, message });
      await newMessage.save();
      io.to(roomId).emit('receive-message', newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
