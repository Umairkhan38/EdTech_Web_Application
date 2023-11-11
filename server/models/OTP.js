const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({

 email:{
    type:String,
    required:true
},
otp:{
    type:String,
    required:true
},
createdAt:{
    type:Date,
    default:Date.now(),
    expires:5*60
}  

});

  
// send Email
async function sendVerificationEmail(email,otp){

    try{
        const mailResponse = await mailSender(email,"verification email from study notion", otp);
        console.log("Email Sent Successfully!!", mailResponse) 
    }
    catch(err){
        conosle.log("error occured while sending mail ",err)
        throw err;
    }
}

//Pre Save middleware to verify otp
 OTPSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email,this.otp)
    next()
 })



module.exports = mongoose.model("OTP",OTPSchema);


