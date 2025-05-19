const validator= require("validator")
    
const validateSignUpData=(req)=>{
    const {firstName, lastName, emailId, password}= req.body

    // Validate value is present for fields of name
    if(!firstName || !lastName){
        throw new Error("Please enter a valid name")
    }

    // Validate whether valid email id 
    else if(!validator.isEmail(emailId)){
        throw new Error("Please enter a valid email Id")
    }

    // Validate whether password is strong
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password")
    }
}


module.exports={
    validateSignUpData
}