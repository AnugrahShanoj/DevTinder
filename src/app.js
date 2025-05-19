// Import express 
const express= require("express")
const connectDB=require("./config/database")
const User= require("./models/user")
const {validateSignUpData}=require('./utils/validation')
const bcrypt=require("bcrypt")
const validator= require("validator")


// Create a server using express
const app= express()

// Middleware to handle json parsing
app.use(express.json())


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
        const isPasswordMatch= await bcrypt.compare(password,user.password)
        if(!isPasswordMatch){
            throw new Error("Invalid Credentials")
        }
        else{
            res.send("User login successfull")
        }
    } catch (error) {
        res.status(500).send("ERROR: "+error.message)
    }
})

// API route for get user
app.get("/user",async (req,res)=>{
    const userEmailId= req.body.emailId
    // console.log(userEmailId)
    try {
        const user= await User.find({emailId:userEmailId})
        if(user.length===0){
            res.status(404).send("User not found")
        }
        else{
            res.send(user)
        }
    } catch (error) {
        res.status(500).send('SOmething went wrong')
    }
})


// API Call for update user details
app.patch("/user/:userId", async(req,res)=>{
    const {userId}= req.params
    const data= req.body
    const UPDATE_ALLOWED=["gender","age","skills"]
    try {
        const isAllowed= Object.keys(data).every(k=>UPDATE_ALLOWED.includes(k))
    if(!isAllowed){
        throw new Error("User cannot update")
    }
    if(data.skills.length>10){
        throw new Error("Maximum 10 skills can be added.")
    }
        const user= await User.findByIdAndUpdate({_id:userId},data,{new:true})
        // console.log(user)
        res.send("User Updated Successfully")
    } catch (error) {
        res.status(400).send(error.message)
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