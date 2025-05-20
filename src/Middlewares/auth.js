const jwt=require("jsonwebtoken")
const User=require("../models/user")

const userAuth=async(req,res,next)=>{
    
    try {
        const {token}=req.cookies
        if(!token){
            throw new Error("Invalid Token")
        }
        const decodedData= await jwt.verify(token,"DEV@Tinder#412")
        const {_id}=decodedData
        const user= await User.findById(_id)
        console.log(user)
        if(!user){
            throw new Error("User not found")
        }
        req.user=user
        next()
    } catch (error) {
        res.status(400).send("ERROR: "+error.message)
    }
}

module.exports={
    userAuth
}