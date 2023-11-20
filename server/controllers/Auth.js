const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();


//send Otp
exports.sendOTP = async (req, res) => {
  try {
    //fetch email from req.body
    const { email } = req.body;

    // chaeck if user ALready Exist
    const checkUserPresnt = await User.findOne({ email });

    //if user already exist
    if (checkUserPresnt) {
      return res.status(401).json({
        success: false,
        message: "user already exist!",
      });
    }

    //generate otp
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabates: false,
      lowerCaseAlphabates: false,
      specialChars: false,
    });

    console.log("OTP generated", otp);

    //check unique otp or not
    const result = await OTP.findOne({ otp: otp });

    //keep checking and generating otp until we found a otp in database
    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabates: false,
        lowerCaseAlphabates: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    //create an entry for otp in databse
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).josn({
      success: true,
      message: "otp sent successfully!!",
      otp,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//SignUp
exports.signUp = async (req, res) => {

try {  
  // fetch data from req.body
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    accountType,
    contactNumber,
    otp
  } = req.body;


   //validate Data
   if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
    return res.status(403).json({
        success:false,
        message:"All field are required!!"
    })

   }

    //match the npassword
    if(password!==confirmPassword){
        return res.status(400).json({
            success:false,
            message:"password and confirm password doesn't matched , please try!"
        })
    }

    ///check user already exist or not
    const existingUser = await User.findOne({email});

    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"user already exist"
        })
    }

    // find Most recent otp stored in a database
    const recentOtp = await OTP.fidOne(({email})
.sort({createdAt:-1}).limit(1))


    console.log("Recent otp is ",recentOtp)

    //validate otp
    if(recentOtp.length==0){
        //otp not found
        return res.status(400).json({
            success:false,
            message:"OTP Not Found"
        })

    }
    else if(otp!==recentOtp.otp){

        //invalid otp
        return res.status(400).json({
            success:false,
            message:"invalid otp"
        })
    } 


    //Hashing a password
    const hashedPassword = await bcrypt.hash(password,10);

    //entry crate in DB
    const profileDetails = await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber :null
    })

    const user = await User.create({

        firstName,
        lastName,
        email,
        contactNumber,
        password:hashedPassword,
        accountType,
        additionalDetails:profileDetails,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`

    })

    return res.status(200).json({
        success:true,
        message:"User is Registered Successfully!!",
        user
    })

}catch(err){
    console.log(err)
    return res.status(500).json({
        success:false,
        message:"User can't be Registered!!"
    })
}

};

//SignIn


exports.login = async(req,res)=>{

    try{
        const {email, password} = req.body;

        //validate data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All Fields are Required!"
            })
        }

        //check user exist or not
        const user = await User.findOne({email}).populate("additionalDetails");

        if(!user){
          return res.status(401).json({
            success:false,
            message:"User is not Registered!"
          })
        }
        
        //compare password and 
        //generate jwt token

        if(await bcrypt.compare(password, user.password)){
          const payload = {
            email:user.email,
            id:user._id,
            role:user.accountType
          }
          
          const token = jwt.sign(payload, process.env.JWT_SECRET,{
            expiresIn:"2h"
          })
          
          user.token = token;
          user.password = undefined;
        
        //create cookie and send response
        const options ={
          expires:new Date(Date.now() + 3*24*60*60*1000),
          httpOnly:true
        }
        res.cookie("token",token,options).status(200).json({
          success:true,
          token,
          user
        })
      }
      else{

        return res.status(401).json({
          success:false,
          message:"password is incorrect"
        })
      }

    }
    catch(err){
      console.log(err);
      return res.status(401).json({
        success:false,
        message:"Login Failed!"
      })

    }

}

//ChangePassword

exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

    
		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};

