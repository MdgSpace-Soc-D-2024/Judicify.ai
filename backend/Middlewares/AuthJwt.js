const express = require('express');
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');

const app = express();

// Enable file uploads
app.use(fileUpload());
const mongoose = require ('mongoose')
const Room = require('../Models/Room');

const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.status(403)
            .json({ message: 'Unauthorized, JWT token is require' });
    }
    try {
        const decoded = jwt.verify(auth, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401)
        .json({ message: 'Unauthorized, JWT token wrong or expired' });
    }
}

const isJudge = (req, res, next) => {
    if (!req.user || !req.user.judge) {
        return res.status(403).json({ message: 'Access restricted to judges only' });
    }
    next();
};


const ensureAccessRoom = async(req, res, next) => {
    const { roomId } = req.params;
    const auth = req.headers['authorization'];
    const decoded = jwt.verify(auth, process.env.JWT_SECRET);
    req.user = decoded;
    if(decoded.judge){
        next();
        return 
    }
    try {
        if (!auth) {
            return res.status(403)
                .json({ message: 'Unauthorized, JWT token is require' });
        }
        const room = await Room.findById(roomId)

        if(!room){
            return res.status(404).json({message: 'Room not found'})
        }

        if(!room.participants.includes(decoded.email)){
            return res.status(403).json({message: 'Access denied, you are not a participant'})
        }
        next();
    } catch (err) {
        return res.status(401)
        .json({ message: 'Unauthorized, JWT token wrong or expired' });
    }
}

module.exports = {
    ensureAuthenticated,
    ensureAccessRoom,
};