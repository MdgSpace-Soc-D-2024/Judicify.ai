const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    roomId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Room', 
        required: true
    },
    sender:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
})

module.exports = mongoose.model('RMessage', messageSchema);