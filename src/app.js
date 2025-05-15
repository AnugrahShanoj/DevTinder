// Import express 
const express= require("express")

// Create a server using express
const app= express()

// Write req handler
app.use((req,res)=>{
    res.send("Hello from the server...")
})

// Listen to a PORT
app.listen(3000,()=>{
    console.log("Server Successfully Listening to 3000")
})