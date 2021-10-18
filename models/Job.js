const mongoose = require('mongoose')
const Schema = mongoose.Schema

const JobsSchema = new Schema({
    company: {
        type: String,
        required: [true, "please provide company name"],
        maxlength: 20
    },
    position: {
        type: String,
        required: [true, "please provide position"],
        maxlength: 20
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User_Model',
        required: [true, 'please provide creator']
    }
}, { timestamps: true })

module.exports = mongoose.model('jobs', JobsSchema)