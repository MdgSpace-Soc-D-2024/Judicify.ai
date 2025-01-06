const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const AuthRouter = require('./Routes/AuthRouter')
const ContentRouter = require('./Routes/ContentRouter')
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 1818;

const server = http.createServer(app);
const io = socketIo(server); 

app.get('/ping', (req, res)=>{
    res.send('PONG')
})

app.use(bodyParser.json())
app.use(cors())
app.use('/auth', AuthRouter)
app.use('/content', ContentRouter)

const roomController =  require('./Controllers/RoomController.js');

app.post('/create-room', roomController.createRoom(io));
app.post('/join-room', (req, res) => {
    roomController.joinRoom(io)(req, res);
});

app.post('/send-message', (req, res) => {
    roomController.sendMessage(io, req.body.roomId, req.body.message, req.body.senderId, res);
});
app.listen(PORT, () =>{
    console.log(`Server is running on ${PORT}`)
})