const Room = require('../Models/Room');
const Message = require('../Models/RMessages');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule'); 

const createRoom = (io) => async (req, res) => {
    const { caseId, participants, scheduledTime , judgeId } = req.body;
    try{
        const room = new Room({
            judgeId,
            caseId,
            participants,
            scheduledTime
        });

        await room.save();

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
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

        res.status(201).json({ success: true, message: 'Room created and invitations sent successfully', room });
    
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const joinRoom = (io) => async (req, res) => {
    try {
        const { roomId, email } = req.body;

        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        if (room.chatState !== 'Open') {
            return res.status(403).json({ message: 'Room is not open for chat yet' });
        }

        if (!room.participants.includes(email)) {
            return res.status(403).json({ message: 'You are not authorized to join this room' });
        }
        io.to(roomId).emit('user-joined', email);

        res.status(200).json({success: true,  message: 'Successfully joined the room' });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to join the room' });
    }
};


const updateChatState = async (req, res) => {
    const { roomId } = req.params;
    const { chatState } = req.body;

    try {
        const room = await Room.findByIdAndUpdate(roomId, { chatState }, { new: true });
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
        io.to(roomId).emit('room-state-updated', chatState);
        res.status(200).json({ success: true, room });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const mongoose = require ('mongoose')
const sendMessage = async (io, roomId, message, senderId, res) => {
    const startTime = Date.now();
    try {
        console.log(`Started processing message at ${startTime}`);
        const newMessage = new Message({
            roomId: new mongoose.Types.ObjectId(roomId),
            sender: senderId,
            message,
        });

        console.log("Saving message to DB...");
        await newMessage.save();
        console.log(`Message saved. Time taken: ${Date.now() - startTime}ms`);

        console.log("Emitting message...");
        io.to(roomId).emit('receive-message', newMessage);
        console.log(`Message emitted. Time taken: ${Date.now() - startTime}ms`);
        res.status(200).json({ success: true, message: 'Message sent successfully', newMessage });

    } catch (err) {
        console.error('Failed to send message:', err);
    }
};


module.exports={
    createRoom,
    joinRoom,
    updateChatState,
    sendMessage
}