const mongoose = require('mongoose');

//connect with atlas cluster
mongoose.connect('mongodb+srv://ajay_pipaliya:HzXr794bwJMEn3eM@cluster0.isj4t.mongodb.net/taskApp?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true
    })
