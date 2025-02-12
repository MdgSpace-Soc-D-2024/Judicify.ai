const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    roomId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Room', 
        required: true
    },
    sender:{
        type: mongoose.Schema.Types.Mixed, 
        ref: 'User', 
        required: true
    },
    message:{
        type: String,
        required: true
    },
    system: { 
        type: Boolean, 
        default: false 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
})

module.exports = mongoose.model('RMessages', messageSchema);