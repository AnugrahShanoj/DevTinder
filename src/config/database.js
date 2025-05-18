const mongoose= require("mongoose")

const connectDB= async()=>{
    await mongoose.connect("mongodb+srv://anugrahshanojp412:P0q9lft5FqId31a0@cluster0.gunqm2j.mongodb.net/devTinder?retryWrites=true&w=majority&appName=Cluster0")
}

module.exports= connectDB