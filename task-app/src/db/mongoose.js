const mongoose = require('mongoose');
const { MONGOURI } = require('../config/key');
//connect with atlas cluster

mongoose.connect(MONGOURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
mongoose.connection.on('connected', () => {
    console.log("connected to mongo")
})
mongoose.connection.on('error', (err) => {
    console.log("err to connect ", err)
})
