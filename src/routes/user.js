const express= require("express")
const ConnectionRequest= require("../models/connectionRequest")
const {userAuth}=require("../Middlewares/auth")
const userRouter= express.Router()

const USER_SAFE_DATA=["firstName","lastName","gender","age","photoURL","skills"]

// API Route for fetching all the connection requests received by the loggedIn user
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try {
        const loggedInUser=req.user
        const data= await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",USER_SAFE_DATA)
        res.json({
            message:"Connection Requests Fetched Successfully",
            data
        })
    } catch (error) {
        res.status(400).send("ERROR: ",error.message)
    }
})

// API Route for fetching all the connections of the loggedIn user
userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try {
        const loggedInUser= req.user
        const connections= await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id, status:"accepted"},
                {toUserId:loggedInUser._id, status:"accepted"}
            ]
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA)

        const data= connections.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({data})
    } catch (error) {
        res.status(400).send("ERROR: ",error.message)
    }
})

module.exports=userRouter