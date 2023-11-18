const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({

    courseName:{
        type:String
    },
    courseDescription:{
        type:String
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
     whatYouWillLearn:{
        type:String
     },
     courseContent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section"
     },
     ratingAndReviews:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview"
        }
    ],

    price:{
        type:Number
    },

    Category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
     },
     
    Tag:{
        type:String
     },
    
     thumbnail:{
        type:String
     },
    
     studentsEnrolled:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
     }
            
});



module.exports = mongoose.model("Course", courseSchema);
