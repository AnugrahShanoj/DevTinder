const mongoose=require("mongoose")
const connectionRequestSchema=mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.ObjectId,
        required:true 
    },

    toUserId:{
        type: mongoose.Schema.ObjectId,
        required:true 
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:`{VALUE} is invalid status type`
        },
    },
},
{timestamps:true})

connectionRequestSchema.pre("save", function (next){
    const connectionRequest=this
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send request to yourself..")
    }
    next()
})

const ConnectionRequest= mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports=ConnectionRequest