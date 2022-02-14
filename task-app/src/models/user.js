const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {JWT_SECRETE} = require('../config/key');
const Task = require('../models/task');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        require:true,
        trim: true
    },
    email:{
        type : String,
        require: true,
        trim:true,
        unique:true,
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
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }],
    avatar:{
        type: Buffer
    }
},{
    timestamps:true
})
 
//create virtual to make relationship between user and task
userSchema.virtual('tasks',{
    ref:"Task",
    localField:"_id",
    foreignField:"owner"
})

// create method to get only public details of logged user
//1) userSchema.methods.getPublicProfile =  function () {
userSchema.methods.toJSON  =  function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}


//create method for generating auth token for user login
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = await jwt.sign({ _id: user._id.toString() }, JWT_SECRETE)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

//create findByCredentials method in User schema
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user)
        throw new Error("Invalid email or password")

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch)
        throw new Error("Invalid email or password")
    console.log("user : ", user.name)
    return user
}

//Hash plain password using bcrypt and save in DB
userSchema.pre('save', async function (next) {
    const user = this
    console.log("just before saving")
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

//Use this middleware to delete all tasks of user after user gets deleted
userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User