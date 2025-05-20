const mongoose= require("mongoose")
const validator= require("validator")
const jwt= require("jsonwebtoken")
const bcrypt= require("bcrypt")
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
},{timestamps:true})

userSchema.methods.getJWT= async function(){
    const user= this
    const token= jwt.sign({_id:user._id},"DEV@Tinder#412",{expiresIn:'1d'})
    return token
}


userSchema.methods.validatePassword= async function(passwordInputByUser){
    const user= this
    const isPasswordValid= await bcrypt.compare(passwordInputByUser,user.password)
    return isPasswordValid
}

const User= mongoose.model("User", userSchema)

module.exports= User 