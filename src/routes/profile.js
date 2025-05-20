const express= require("express")
const {userAuth}= require("../Middlewares/auth")


const profileRouter= express.Router()

// API route for get profile
profileRouter.get("/profile",userAuth,async(req,res)=>{
    try {
        const user= req.user
        res.send(user)
    } catch (error) {
        res.status(500).send("ERROR: "+error.message)
    }

})



module.exports= profileRouter