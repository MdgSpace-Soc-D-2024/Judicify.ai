const Room = require('../Models/Room');
const Message = require('../Models/RMessages');
const nodemailer = require('nodemailer');
const mongoose = require ('mongoose')
const schedule = require('node-schedule'); 
const Pdfs = require('../Models/Pdfs')
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

app.use(fileUpload());

const createRoom = (io) => async (req, res) => {
      const { caseId, participants, scheduledTime, judgeId } = req.body;
      try {
        const room = new Room({
          judgeId,
          caseId,
          participants,
          scheduledTime,
        });
  
        await room.save();
  
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });
  
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: participants.join(', '),
          subject: `Invitation to Case Room: ${caseId}`,
          text: `You have been invited to join the case room.\n\nCase ID: ${caseId}\nScheduled Time: ${scheduledTime}\nJoin Link: ${process.env.CLIENT_URL}/room/join/${room._id}`,
        };
  
        await transporter.sendMail(mailOptions);
  
        schedule.scheduleJob(new Date(scheduledTime), async () => {
          await Room.findByIdAndUpdate(room._id, { chatState: 'Open' });
          console.log(`Chat room ${room.caseId} is now open.`);
        });
  
        io.emit('room-created', room._id);
  
        res.status(201).json({
          success: true,
          message: 'Room created and invitations sent successfully',
          room,
        });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    };


const joinRoom = (io) => {
  return async (req, res) => {
    const { roomId } = req.params;  

    try {
      const room = await Room.findById(roomId);

      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

      if (room.chatState !== 'Open') {
        return res.status(403).json({ message: 'Room is not open for chat yet' });
      }

      io.to(roomId).emit('user-joined', `${req.user.name} joined the room`);

     return res.status(200).json({ success: true, message: 'Successfully joined the room' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to join the room' });
    }
  };
};

const updateRoomState = (io) => {
    return async (req, res) => {
      const { roomId } = req.params;
      const { chatState } = req.body;
  
      try {
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        room.chatState = chatState;
        await room.save();
        
        io.to(roomId).emit('room-state-updated', chatState);
        res.status(200).json({ message: 'Room state updated successfully' });
      } catch (err) {
        res.status(500).json({ message: 'Failed to update room state' });
      }
  };
};

const uploadPdfDb = async (req, res) => {
  try {
    console.log(req.files)
    console.log(req.body)
    const { roomId, user } =req.body ;
    const pdfFile = req.files.pdf;
    const fileName = `${roomId}_${user}.pdf`;
    const newPDFFile = new Pdfs({
      roomId,
      sender : user,
      fileName,
      fileData: pdfFile.data,
    });
    await newPDFFile.save();
    res.json({ message: 'PDF uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload PDF' });
  }
};

const getPdfDb = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    const pdfs = await Pdfs.find({ roomId });
    
    if (!pdfs || pdfs.length !== 2) {
      return res.status(404).json({ 
        error: ' exactly 2 PDFs in tNeedhis room for comparison' 
      });
    }
    res.json({
      pdf1: {
        data: pdfs[0].fileData,
        filename: pdfs[0].fileName
      },
      pdf2: {
        data: pdfs[1].fileData,
        filename: pdfs[1].fileName
      }
    });

  } catch (error) {
    console.error('Error retrieving PDFs:', error);
    res.status(500).json({ error: 'Failed to retrieve PDFs' });
  }
};

getMessagesForRoom = async (req, res) => {
    const { roomId } = req.params;
  
    try {
      const messages = await Message.find({ roomId: roomId }).sort({ timestamp: 1 })
      res.status(200).json({ success: true, messages });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch messages' });
      console.log("hello")
    }
  };

module.exports={
    createRoom,
    joinRoom,
    updateRoomState,
    uploadPdfDb,
    getPdfDb,
    getMessagesForRoom
}