const mongoose = require('mongoose');
const {MONGOURI} = require('../config/key');
//connect with atlas cluster
// mongoose.connect('mongodb+srv://ajay_pipaliya:HzXr794bwJMEn3eM@cluster0.isj4t.mongodb.net/taskApp?retryWrites=true&w=majority',{
//     useNewUrlParser:true,
//     useUnifiedTopology:true
//     })

    mongoose.connect(MONGOURI,{
        useUnifiedTopology:true,
        useNewUrlParser:true
    })
    // mongoose.connection.on('connected',()=>{
    //     console.log("connected to mongo")
    // })
    // mongoose.connection.on('error',(err)=>{
    //     console.log("err to connect ",err)
    // })
    