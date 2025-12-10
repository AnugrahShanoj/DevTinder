// Import express 
const express= require("express")
const connectDB=require("./config/database")
const cookieParser=require('cookie-parser')
const authRouter=require("./routes/auth")
const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request")
const userRouter = require("./routes/user")
const cors= require("cors");
// Create a server using express
const app= express()

//Middleware to handle cors 
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}))

// Middleware to handle json parsing
app.use(express.json())

// Middleware to handle cookie parsing
app.use(cookieParser())

// API Routes
app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)

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