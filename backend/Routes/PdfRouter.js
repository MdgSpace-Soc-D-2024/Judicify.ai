const express = require('express');
const {ensureAuthenticated, ensureAccessRoom} = require('../Middlewares/AuthJwt');
const {
  getPdfDb,
} = require('../Controllers/RoomController.js');

const router = require('express').Router()
router.get('/:roomId', getPdfDb)

module.exports = router;