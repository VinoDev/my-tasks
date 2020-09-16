const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value))
                throw new Error("Email is not valid!");
        }
    },
    password: {
        type: String,
        trim: true,
        lowercase: true,
        minlength: 7,
        validate(value) {
            if(value.includes("password"))
                throw new Error("The word 'password' cannot be part of your password");
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) 
                throw new Error("Age cannot be a negative number")
        }
    }
})

module.exports = User;