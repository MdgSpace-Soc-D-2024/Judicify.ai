const express = require('express');
const {ensureAuthenticated, ensureAccessRoom} = require('../Middlewares/AuthJwt');
const {
  uploadPdfDb,
} = require('../Controllers/RoomController.js');

const router = require('express').Router()
router.post('/', ensureAuthenticated, uploadPdfDb)

module.exports = router;