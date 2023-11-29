const User = require("../models/User");
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');
const crypto = require("crypto")

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

    const token = crypto.randomUUID();
    
    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
        { email: email},
        {
            token: token,
            resetPasswordExpires:Date.now() + 3600000,
        },
        { new: true }
    );


    //create URL
    const url = `http://localhost:3000/update-password/${token}`;
    
    //send mail containing url
    await mailSender(email,"password Reset Link",`passwordReset Link : ${url}`)
    
    //return response
    return res.json({
        success:true,
        message:"Email Sent Successfully!!",
        user,
        updatedDetails
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
exports.resetPassword = async (req, res) => {
	try {
		const { password, confirmPassword, token } = req.body;

		if (confirmPassword !== password) {
			return res.json({
				success: false,
				message: "Password and Confirm Password Does not Match",
			});
		}
		const userDetails = await User.findOne({ token: token });
		if (!userDetails) {
			return res.json({
				success: false,
				message: "Token is Invalid",
			});
		}
		if (!(userDetails.resetPasswordExpires > Date.now())) {
			return res.status(403).json({
				success: false,
				message: `Token is Expired, Please Regenerate Your Token`,
			});
		}
		const encryptedPassword = await bcrypt.hash(password, 10);
		await User.findOneAndUpdate(
			{ token: token },
			{ password: encryptedPassword },
			{ new: true }
		);
		res.json({
			success: true,
			message: `Password Reset Successfull`,
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Updating the Password`,
		});
	}
};