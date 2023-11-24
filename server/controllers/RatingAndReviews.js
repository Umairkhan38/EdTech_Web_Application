const RatingAndReviews = reqiure('../models/RatingAndReviews');
const Course  = require('../models/Course');
const RatingAndReview = require('../models/RatingAndReview');


exports.createRatingAndReview = async (req,res) =>{

   try{
    //get user id
    const userId = req.user.id;

    //get data from body 
    const{rating, review, courseId} = req.bod7y;

    //check user is enrolled in a course or not
    const courseDetails = await Course.findOne(
        {_id:courseId,studentsEnrolled:{$elemMatch : {$eq : userId}}} );

    if(!courseDetails){
        return res.status(404).json({
            success:false,
            message:"User not enrolled to the course!"
        })
    }

        //check user is already reviewd or not?
        const alreadyReview = await RatingAndReviews.findOne({ user:userId, course:courseId });

        if(alreadyReview){
            return res.status(401).json({
                success:false,
                message:"User has already reviewd!"
            })
        }

        // add rating and review into schema
        const ratingReview = await RatingAndReview.create({
                rating,review,course:courseId
        })

        //update course schema
        const updatedCourseDetails = await Course.findAndByIdAndUpdate({_id:courseId},{
            $push:{
                RatingAndReview:ratingReview._id
            }
        }, {new:true})

        console.log("updatedCourse details ", updatedCourseDetails);


        //return response
        return res.status(201).json({
            success:true,
            message:"Rating and Review Created Successfully!",
            ratingReview
        },{new:true})
        
    }   

    catch(err){
        
        return res.status(500).json({
            success:false,
            message:"Rating and Review can't be created!",
        })

    }

}




//Calculate Average Rating of course
//find average rating

exports.getAverageRating = async(req,res)=>{

    try{
     //get courseId
     const {courseId} = req.body
 
     const result = await RatingAndReview.aggregate([
         {
             $match:{ course :  new mongoose.Types.ObjectId(courseId)}
         },
         {
             $group:{
                 _id : null,
                 averageRating : {$avg: "$rating"}
             }
         }
     ]);
 
 
     if(result.length>0){
 
         return res.status(200).json({
             success:true,
             message:"Average rating calculated Successfully",
             averageRating:result[0].averageRating
     
         })
     }
     
     return res.status(200).json({
         success:true,
         message:"Average rating is 0, no ratings till now!",
         averageRating:0
     })
     
 }
 
 catch(err){
         return res.status(500).json({
             success:false,
             message:"Can't finde Average rating!"
         })
 
     }
 }




//get all ratings
exports.getAllRating = async (req, res) => {
    try{
            const allReviews = await RatingAndReview.find({})
                                    .sort({rating: "desc"})
                                    .populate({
                                        path:"user",
                                        select:"firstName lastName email image",
                                    })
                                    .populate({
                                        path:"course",
                                        select: "courseName",
                                    })
                                    .exec();
            return res.status(200).json({
                success:true,
                message:"All reviews fetched successfully",
                data:allReviews,
            });
    }   
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    } 
}



