const ConnectionRequest=require("../models/connectionRequest")
const {userAuth}=require("../Middlewares/auth")
const express=require("express")

const requestRouter= express.Router()

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
    const fromUserId= req.user._id
    const status=req.params.status
    const toUserId=req.params.toUserId
    const allowedStatuses=["ignored","interested"]
    if(!allowedStatuses.includes(status)){
        return res.status(400).json({message:"Invalid Status Type "+status})
    }

    // If there is an existing ConnectionRequest
    const existingConnectionRequest= await ConnectionRequest.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId, toUserId:fromUserId}
        ]
    })
    if(existingConnectionRequest){
        return res.status(400).json({message:"Connection Already Existing"})
    }
    const connectionRequest= new ConnectionRequest({
        fromUserId, toUserId, status
    })

    const data= await connectionRequest.save()
    res.json({message:"Connection request "+status})
}
catch(error){
    res.status(400).send("ERROR: "+error.message)
}
})


requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res)=>{
    try {
        const loggedInUser= req.user
    const {status, requestId}= req.params
    const allowedStatus=["accepted","rejected"]

    // Validate incoming status
    if(!allowedStatus.includes(status)){
        return res.status(400).json({
            message:"Invalid Status"
        })
    }

    //Retreive connection from DB while validating loggedInUser._id, requestId, status: interested
    const connectionRequest= await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:loggedInUser._id,
        status:"interested"
    })
    if(!connectionRequest){
        return res.status(404).json({
            message:"Connection request not found"
        })
    }
    connectionRequest.status=status
    await connectionRequest.save()
    res.json({
        message:"Connection request is "+status
    })
    } catch (error) {
      res.status(400).send("ERROR: "+error.message)  
    }
})



module.exports=requestRouter