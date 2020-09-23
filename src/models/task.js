const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    done: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }    
})

taskSchema.pre('save', async function(next){
    const task = this;

    console.log("Task middleware");

    next();
})

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;