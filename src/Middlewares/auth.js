const adminAuth= (req,res,next)=>{
    const token="xyz"
    const isAuthorizedAdmin=token==="xyz"
    try {
        if(isAuthorizedAdmin){
            console.log("Admin Authorized Succesfully")
            next()
        }
    } catch (error) {
        res.status(500).send("Something went wrong")
    }
}


const userAuth=(req,res,next)=>{
    const token="abc"
    const isAuthorizedUser=token==="abc"
    try {
        if(isAuthorizedUser){
            console.log("User Authorized Successfully")
            next()
        }
    } catch (error) {
        res.status(500).send("something went wrong")
    }
}

module.exports={
    adminAuth,userAuth
}