// Import express 
const express= require("express")
const connectDB=require("./config/database")
const User= require("./models/user")
const {validateSignUpData}=require('./utils/validation')
const bcrypt=require("bcrypt")
const validator= require("validator")
const cookieParser=require('cookie-parser')
const jwt=require("jsonwebtoken")
const {userAuth}= require("./Middlewares/auth")

// Create a server using express
const app= express()

// Middleware to handle json parsing
app.use(express.json())

// Middleware to handle cookie parsing
app.use(cookieParser())


// Create an instance of user model
app.post("/signup", async (req,res)=>{
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
    // console.log(user)
    await user.save()
    res.send("User Added Successfully..")
} catch (error) {
    res.status(500).send("Cannot Add User: "+error.message)
}
})

//Create API route for login
app.post("/login",async(req,res)=>{
    const {emailId, password}= req.body

    try {
        // Validate email Id
        const isValidEmailId=validator.isEmail(emailId)
        if(!isValidEmailId){
            throw new Error("Please enter a valid emailId")
        }
        const user= await User.findOne({emailId})
        // console.log(user)
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
            res.send("User login successfull")
        }
    } catch (error) {
        res.status(500).send("ERROR: "+error.message)
    }
})

// API route for get profile
app.get("/profile",userAuth,async(req,res)=>{
    try {
        const user= req.user
        res.send(user)
    } catch (error) {
        res.status(500).send("ERROR: "+error.message)
    }

})




// Proper way of connecting to the DB and later listening to the server
connectDB().then(()=>{
    console.log("Database Connected Successfully...")
    // Listen to server
    app.listen(3000,()=>{
        console.log("Server Successfully Listening to 3000")
    })
})
.catch((err)=>{
    console.log("Database cannot be connected: ",err)
})