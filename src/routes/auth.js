const express= require("express")
const User= require("../models/user")
const {validateSignUpData}=require('../utils/validation')
const bcrypt=require("bcrypt")
const validator= require("validator")


const authRouter= express.Router()

// Create an instance of user model
authRouter.post("/signup", async (req,res)=>{
    const {firstName, lastName, emailId, password}= req.body
try {
    // Perform validation phase
    validateSignUpData(req)

    // Password Encryption
    const passwordHash= await bcrypt.hash(password,10)
    const user= new User ({
        firstName,
        lastName,
        emailId,
        password:passwordHash
    })
    const savedUser=await user.save();
    const token= await user.getJWT();
    res.cookie("token",token,{expires:new Date(Date.now()+ 8*3600000)});
    res.json({message:"User Added Successfully..", data: savedUser});
} catch (error) {
    res.status(500).send("Cannot Add User: "+error.message)
}
})

//Create API route for login
authRouter.post("/login",async(req,res)=>{
    const {emailId, password}= req.body

    try {
        // Validate email Id
        const isValidEmailId=validator.isEmail(emailId)
        if(!isValidEmailId){
            throw new Error("Please enter a valid emailId")
        }
        const user= await User.findOne({emailId})
        if(!user){
            throw new Error("Invalid Credentials")
        }
        const isPasswordValid= await user.validatePassword(password)
        if(!isPasswordValid){
            throw new Error("Invalid Credentials")
        }
        else{
            const token= await user.getJWT()
            res.cookie("token",token,{expires:new Date(Date.now()+ 8*3600000)})
            res.send(user);
        }
    } catch (error) {
        res.status(500).send("ERROR: "+error.message)
    }
})


// Create API route for logout
authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now())
    })
    res.send("Logout Successful...")
})

module.exports= authRouter