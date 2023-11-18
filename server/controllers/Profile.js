const User = require('../models/User');
const Profile = require('../models/Profile');

exports.updateProfile = async(req,res)=>{

    try{

        const {dateOfBirth="", about="", contactNumber, gender} = req.body;
        //get userId
        const userId = req.user.id;

        //validation
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success:false,
                message:"all fields are required!"
            })
        }

        //find profile
        const userProfile = await User.findById(userId);
        const profileId = userProfile.additionalDetails;
        const profileDetails = await Profile.findById(profileId)

        //update profile
        profileDetails.dateOfBirth = dateOfBirth ;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;
        await profileDetails.save();

        //return response
        return res.status(200).json({
            success:true,
            message:"profile updated successfully",
            profileDetails
        })

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"profile can't be updated"
        })

    }


}


exports.deleteAccount = async (req,res)=>{

    try {

        const id = req.user.id;
        const userDetails = await User.findById(id);

        if(!userDetails){
                return res.status(404).json({
                    success:false,
                    message:"user not found"
                })
        }

        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

        await User.findByIdAndDelete({_id:id});

        return res.status(200).json({
            success:true,
            message:"User Deleted Successfully!!"
        })
        
        
    } catch (error) {
        
        return res.status(500).json({
            success:false,
            message:"unable to  Delete User!!"
        })
    }

}


 exports.getAllUsers = async(req,res)=>{

    try {
       const id = req.user.id;
       
       const userDetails = await User.findById(id).populate("Profile").exec();

       return res.status(200).json({
        success:true,
        message:"All User Fetched Successfully!"
       })
        
    }catch(error) {

        return res.status(500).json({
            success:false,
            message:"unable to get users!",
            error:error.message
        })
    }
 }
 