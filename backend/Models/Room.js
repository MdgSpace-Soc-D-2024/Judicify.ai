const { string, required } = require('joi');
const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    judgeId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    caseId:{
        type: String,
        required: true
    },
    participants:[{
        type: String,
        required: true
    }],
    scheduledTime:{
        type: Date,
        required: true
    },
    chatState:{
        type: String,
        default : 'Closed'
    },
    messages:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'RMessages'
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
})

module.exports = mongoose.model('Room', roomSchema);