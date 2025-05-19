const mongoose= require("mongoose")
const validator= require("validator")
const userSchema= new mongoose.Schema({
    firstName:{
        type: String,
        required:true,
        trim:true,
        minLength:3,
        maxLength:15
    },
    lastName:{
        type: String,
        trim:true,
        minLength:3,
        maxLength:15
    },
    emailId:{
        type: String,
        required:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email ID"+value)
            }
        }
    },
    password:{
        type: String,
        required:true,
        minLength:8,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password")
            }
        }
    },
    age:{
        type: Number,
        min:18
    },
    gender: {
        type: String,
        enum:["Male","Female","Others"]
    },
    skills:{
        type:[String],
        default:["No Skills"]
    },
    photoURl:{
        type:String,
        default:"https://static.vecteezy.com/ti/vecteur-libre/p1/5544753-profil-icone-design-vecteur-gratuit-vectoriel.jpg",
        trim:true,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL")
            }
        }
    }
})

const User= mongoose.model("User", userSchema)

module.exports= User 