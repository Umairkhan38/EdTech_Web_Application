const Section = require('../models/Section');
const SubSection = require('../models/SubSection');
const SubSection = require('../models/SubSection');
const {uploadImageToCloudinary} = require('../utils/imageUploader')



//Create SubSection
exports.createSubSection = async (req,res)=>{

    try{
        // fetch data from req.body
        const {sectionId, title, timeDuration, description } = req.body;

        //extract video file
        const video = req.files.videoFile;

        //Validation
        if(!sectionId || !title || !timeDuration || !description ){
            return res.status(400).json({
                success:false,
                message:"All Fields are required!"
            })
        }

        //upload a video
        const uploadVideo = await uploadImageToCloudinary(video, process.env.FOLDER_NAME)

        //create a sub section
        const subSectionDetails = await SubSection.create({
            title,
            timeDuration,
            description,
            videoUrl: uploadVideo.secure_url
        })


        //update sub-section in a section schema
        const updateSection = await Section.findByIdAndUpdate({_id:SubSection._id},{
            $push:{
                subSection:subSectionDetails._id
            }
        },{new:ture}).populate("SubSection")

        //resposne 
        return res.status(200).json({
            success:true,
            message:"SubSection created Succesfully!",
            updateSection
        })

    }
    catch(err){

        return res.status(500).json({
            success:false,
            message:"Unable to create SubSection!",
            error:err.message
        })


    }
}

//Home Work
//Update SubSection


//Delete SubSection
