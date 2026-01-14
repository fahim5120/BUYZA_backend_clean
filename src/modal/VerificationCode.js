const { default: mongoose } = require("mongoose");

const verificationCodeSchema= new mongoose.Schema({
 otp: { 
        type: String, 
       
    }, email: { 
        type: String, 
        required: true ,
        unique: true, 
    },
})

const verificationCode=mongoose.model("VerificationCode",verificationCodeSchema)

module.exports=verificationCode
