const mongoose = require('mongoose');
const validator = require('validator');

//connect with atlas cluster
mongoose.connect('mongodb+srv://ajay_pipaliya:HzXr794bwJMEn3eM@cluster0.isj4t.mongodb.net/taskApp?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true
    })


const User = mongoose.model('User',{
    name : {
        type : String,
        require:true
    },
    email:{
        type : String,
        require: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Address!")
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

const user = new User({
 name : "ajay",
 email : "ajay.com",
 age : 21
})

user.save().then(()=>{
 console.log(user)
}).catch((err)=>{
    console.log("Error :",err)
})

// const Task = mongoose.model('Task',{
//     description:{
//         type: String
//     },
//     completed:{
//         type: Boolean
//     }
// })

// const task = new Task({
//     description:'Learn the mongoose library',
//     completed: false
// })

// task.save().then(()=>{
//     console.log(task)
// }).catch((error)=>{
//     console.log("Error",error)
// })