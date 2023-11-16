const Tags = require('../models/Tags');
const User = require('../models/User');
const Section = require('../models/Section');
const Course = require('../models/Course');
const {uploadImageToCloudinary} = require('../utils/imageUploader');


exports.createCourse = async(req,res)=>{

   try {
    
    const {courseName, courseDescription, whatYouWillLearn, price, tags } = req.body;
    
    //get thumbnail
    const thumbnail = req.files.thumbnailImage;

    //validation
    if(!courseName|| !courseDescription || !whatYouWillLearn || !price || !tags || !thumbnail){

        return res.status(400).json({
            success:false,
            message:"all fields are required"
        })
    }

        //Check for instructor
        const userId = req.user._id
        const instructorDetals = await User.findById(userId);
        console.log("Instructor details are ", instructorDetals);


        if(!instructorDetals)
        {
            res.status(404).json({
                success:false,
                message:"Instructror details not found"
            })
        }

        //check the tag is valid or not
        const tagDetails = await Tags.findById(tags);

        if(!tagDetails){

            return res.status(404).json({
                success:false,
                message:"Tag Details not Found"
            })
        }


        //upload image to cloudinary

        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)

        //create an entry in course 
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetals._id,
            whatYouWillLearn,
            price,
            tag:tagDetails._id,
            thumbnail : thumbnailImage.secure_url
        })

        //update instructor courses

        await User.findByIdAndUpdate(
            {_id:instructorDetals._id},
            {
                $push:{
                    courses:newCourse.newCourse._id
                }
            },
            {new:true}
            )   

            const tagId= tagDetails._id;
            await Tags.findByIdAndUpdate({tagId},{course:newCourse._id});


            
            res.status(200).json({
                success:true,
                message:"Course Created Successfully!"
            })

    }
    catch(err){

        res.status(500).json({
            success:false,
            message:"Failed To create a course!"
        })
}

}




//get All Courses

exports.getAllCourses = async(req,res)=>{

    try{
        const allCourses = await Course.find({}, {courseName:true,
        courseDescription:true, tag:true, instructor:true, thumbnail:true, ratingAndReviews:true,
        studentsEnrolled:true}).populate("instructor").exec()
        
        res.status(200).json({
            success:true,
            message:"Data for all the courses fetched Successfully!",
            data:allCourses
        })
          
        
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Can't Fetch the courses",
            error:err.message
        })

    }
}
