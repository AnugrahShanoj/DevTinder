const express= require("express")
const {userAuth}= require("../Middlewares/auth")
const {validateEditData}=require("../utils/validation")

const profileRouter= express.Router()

// API route for get profile
profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try {
        const user= req.user
        res.send(user)
    } catch (error) {
        res.status(500).send("ERROR: "+error.message)
    }

})


// API route for edit user profile
profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
   try {
    const isEditAllowed=validateEditData(req)
    if(!isEditAllowed){
        throw new Error("Invalid Edit Request")
    }
    const loggedInUser= req.user
    Object.keys(req.body).forEach((key)=>loggedInUser[key]=req.body[key])
    await loggedInUser.save()
    res.send(`${loggedInUser.firstName} your profile updated successfully`)
   } catch (error) {
    res.status(400).send("ERROR: "+error.message)
   }

})



module.exports= profileRouter