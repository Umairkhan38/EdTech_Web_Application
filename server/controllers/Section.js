const Section = require('../models/Section');
const Course = require('../models/Course');


exports.createSection = async(req,res)=>
{   

  try{  
    const { sectionName, courseId } = req.body;

    if(!sectionName || !courseId){

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
    },{new:true}).populate({
        path: "courseContent",
        populate: {
            path: "subSection",
        },
    })
    .exec();
;

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


//updating a section name

exports.updateSection=async(req,res)=>{

try {//get data from req.body
    const {sectionId, sectionName} = req.body;

    //Validation
    if(!sectionId || !sectionName){
        return res.status(400).json({
            success:false,
            message:"all fields are required"
        })
    }

    //Update Data
    const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});

    //return res
    res.status(200).json({
        success:true,
        message:"Section Updated Successfully!!",
        section
    })

}
catch(err){
    return res.status(500).json({
        success:false,
        message:"Section Can't be Updated!!"
    })
}

}


//Delete Section

exports.deleteSection = async (req,res) =>{

  try{  //get data
    const {sectionId} = req.body;

    // delete the section
    await Section.findByIdAndDelete(sectionId);
    
    // return response
    return res.status(200).json({
        success:true,
        message:"Section Deleted Successfully!!",
    })
    }
    
    catch(err){
        return res.status(500).json({
            success:false,
            message:"unable to delete section!"
        })
    }
}