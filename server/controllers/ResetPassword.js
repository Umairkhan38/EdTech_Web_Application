const User = require("../models/User");
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');

//Reset Passsword Token
exports.resetPasswordToken = async(req,res)=>{

    try{ 
       //get email from body
    const email = req.body.email;

    //check user for this email
    const user = await User.findOne({email:email})

    if(!user){
        res.status(401).json({
            success:false,
            message:"email is not registered!"
        })
    }
    //generate token

    const token = crypto.randomUUID()
    //update user by adding token and expiration time
    const updateDetails = await User.findOne({email},{token,resetPasswordExpires:Date.now()+5*60*1000},
    {new:true})


    //create URL
    const url = `http://localhost:3000/update-password/${token}`;
    
    //send mail containing url
    await mailSender(email,"password Reset Link",`passwordReset Link : ${url}`)
    
    //return response
    return res.json({
        success:true,
        message:"Email Sent Successfully!!"
    })
}

catch(err){
    console.log(err);
    return res.status(500).json({
        success:false,
        message:"something went wrong"
    })
} 

}



//Reset Password
exports.resetPassword = async (req,res)=>{

try{
    //data fetch
    const {password, confirmPassword, token} = req.body;

    //validation
        if(password !==confirmPassword){
            return res.json({
                success:false,
                message:"Password Nopt Working"
            })
        }

        //get userDetails from db using token
        const userDetails = await User.findOne({token});
        //if no entry - invalid token
        if(!userDetails){
        return res.json({
            success:false,
            message:"Token is Invalid"
            })
        }

        //token time check
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"Token is Expires, Please Regenerate the token"
            })
        }
     const hashedPassword = await hash(password,10);
     
     //password update
     await User.findOneAndUpdate({token},
        {password:hashedPassword},
        {new:true})

        //return response
        return res.status(200).json({
            success:true,
            message:"password reset Successfully!"
        })

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Password Reset Failed!"
        })

    }
} 