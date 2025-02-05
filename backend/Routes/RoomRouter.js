const express = require('express');
const {ensureAuthenticated, ensureAccessRoom} = require('../Middlewares/AuthJwt');
const {
  createRoom,
  joinRoom,
  updateRoomState,
  getMessagesForRoom,
} = require('../Controllers/RoomController.js');


module.exports = (io) => {
  const router = express.Router();
  router.post('/create', ensureAuthenticated, createRoom(io))
  router.get('/:roomId/messages', ensureAuthenticated, getMessagesForRoom); // Fetch messages
  router.post('/:roomId/join', ensureAccessRoom, joinRoom(io)); // Join room
  router.patch('/:roomId/close', ensureAuthenticated, updateRoomState(io)); // Update room state

  return router;
};
