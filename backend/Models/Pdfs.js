const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const pdfFileSchema = new Schema({
    roomId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Room', 
        required: true
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    fileName:{
        type: String,
        required: true
    },
    fileData:{
        type: Buffer,
        required: true
    },
    uploadedAt: { 
        type: Date, 
        default: Date.now 
    }
})

module.exports = mongoose.model('Pdfs', pdfFileSchema);