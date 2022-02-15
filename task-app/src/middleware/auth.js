const jwt = require("jsonwebtoken")
const User = require("../models/user")

const auth = async (req, res, next) => {
    console.log("In auth.js")
    try {   
        console.log("token",req.header('Authorization'))

        const token = req.header('Authorization').split(" ")[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRETE)
        const user = await User.findOne({_id:decoded._id ,'tokens.token':token})
        
        if(!user){
            throw new Error("User not authorized.")
        }
        req.token = token
        req.user = user
    } catch (err) {
        res.status(401).send({ error: "Please authenticate first." })
    }
    next()
}
module.exports = auth