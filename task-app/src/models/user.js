const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User',{
    name : {
        type : String,
        require:true,
        trim: true
    },
    email:{
        type : String,
        require: true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Address!")
            }
        }
    },
    password:{
        type: String,
        trim:true,
        require:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error("password cannot contain password")
            }
        }
    },
    age:{
        type:Number,
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    }
})

module.exports = User