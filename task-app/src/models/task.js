const mongoose = require('mongoose');
const validator = require('validator');


const taskSchema = new mongoose.Schema({
    description:{
        type: String,
        trim: true,
        require:true
    },
    completed:{
        type: Boolean,
        trim: true,
        default:false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
})

const Task = mongoose.model('Task',taskSchema)
module.exports = Task