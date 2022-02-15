const mongoose = require('mongoose');
const MONGOURI  = process.env.MONGODB_URL

//connect with atlas cluster

mongoose.connect( MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology:true
})

mongoose.connection.on('connected', () => {
    console.log("connected to mongo")
})
mongoose.connection.on('error', (err) => {
    console.log("err to connect ", err)
})

