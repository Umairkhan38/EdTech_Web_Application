const Section = require('../models/Section');
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
        const uploadVideo = await uploadImageToCloudinary(video, process.env.FOLDER_NAME,1000,1000);

        console.log("video uploading ",uploadVideo)

        //create a sub section
        const subSectionDetails = await SubSection.create({
            title,
            timeDuration,
            description,
            videoUrl: uploadVideo.secure_url
        })

        console.log("subSection Details are ",subSectionDetails._id);


        //update sub-section in a section schema
        const updateSection = await Section.findByIdAndUpdate({_id:sectionId},{
            $push:{
                subSection:subSectionDetails._id
            }
        }).populate("subSection")
        
        // console.log("Updated Subsection is ", updateSection)

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

exports.updateSubSection = async (req, res) => {
    try {
      const { sectionId,subSectionId, title, description } = req.body

      const subSection = await SubSection.findById(subSectionId)
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      
      if (req.files && req.files.video !== undefined) {
        const video = req.files.video
        const uploadDetails = await uploadImageToCloudinary(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await subSection.save()
  
      const updatedSection = await Section.findById(sectionId).populate("subSection")


      return res.json({
        success: true,
        data:updatedSection,
        message: "Section updated successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })
    }
  }

  
  exports.deleteSubSection = async (req, res) => {
    
    try {
    
      const { subSectionId, sectionId } = req.body
  
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSection: subSectionId,
          },
        }
      )
  

      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }

      const updatedSection = await Section.findById(sectionId).populate("subSection")
  
      return res.json({
        success: true,
        data:updatedSection,
        message: "SubSection deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
  }
