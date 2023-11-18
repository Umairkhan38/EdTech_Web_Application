const Section = require('../models/Section');
const Course = require('../models/Course');


exports.createSection = async(req,res)=>
{   

  try{  const { courseName, courseId } = req.body;

    if(!courseName || !courseId){

        return res.status(400).json({
            success:false,
            message:"All fileds are required"    
        })
    }

    const newSection = await Section.create({sectionName});
    
    const updateCourseDetails = await Course.findByIdAndUpdate(courseId,{
            $push:{
                courseContent:newSection._id
            }
    },{new:true}).populate("Section").populate("SubSection")

    res.status(201).json({
        success:true,
        message:"Section Created Successfully!!",
        updateCourseDetails
    })

    }
    catch(err){

        return res.status(500).json({
            success:false,
            message:"Unable to create a section",
            error:err.message
        })
    }
}