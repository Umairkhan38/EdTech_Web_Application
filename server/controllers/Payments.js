const razorpay = require('razorpay');
const {instance} = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const {courseEnrollmentEmail } = require('../mail/templates/courseEnrollmentEmail');
const mongoose = require('mongoose');


//capture the payment
exports.capturePayment = async (req,res)=>{

    //get courseId and userId
    const {courseId} = req.body;
    const userId = req.user.id;
    
    if(!courseId){
        return res.status(404).json({
            success:false,
            message:"Invalid Course Id",
        })
    }

    //Vlaid CourseDetails
    let course 
    try{
        course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                success:false,
                message:"Cours not Found"
            })
        }

        //Check Whether user is Already Enrolled or not ?
        const uid = new mongoose.Types.ObjectId(userId);    
        
        if(course.studentsEnrolled.includes(uid)){
            res.status(200).json({
                success:false,
                message:"User is Already Enrolled Into Course"
            })
        }
 


    }catch(err){
        res.status(404).json({
            success:false,
            message:err.message
        })

    }


    
    //order creation
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount:amount*100,
        currency,
        reciept : Math.random(Date.now()).toString(),
        notes:{
            courseId,
            userId
        }
    }


    try
    {
        const paymentResponse = await instance.order.create(options);
        console.log(paymentResponse);
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Couldn't initiate payment"
        })

    }

}



//Signature verification from Server and Razorpay
exports.verifySignature= async(req,res)=> {

    const webhookSecret = "12356789";

    const signature = req.headers["x-razorpay-signature"];

    const shaSum = crypto.createHmac("sha2566", webhookSecret);
    shaSum.update(JSON.stringify(req.body))
    const digest = shaSum.digest("hex");

    if(signature == digest ){
        console.log("Payment is Authorized");

        const {courseId, userId} = req.body.payload.payment.entity.notes;

        try{

            const enrolledCourse = await Course.findOneAndUpdate(
                {_id:courseId},
                {$push:{studentsEnrolled:userId}},
                {new:true} )

             if(!enrolledCourse){
                return res.status(404).json({
                    success:false,
                    message:"Course Not Found"
                })
             }   

             console.log("Enrolled Course is ", enrolledCourse);

             //enrolled course into the student schema
             const enrollStudent = await User.findOneAndUpdate(
                {_id:userId},
                {$push:{courses:courseId}},
                {new:true} )

                console.log("enroll student ", enrollStudent)
                
                //Sending successfull mail
                const emailResponse = await mailSender(
                    enrollStudent.email,
                    "Congratulations from Team - Wisdom Warrior Academy", 
                    "You are Succesfully enrolled for the course",
                    
                    )
                    
                    console.log("Email Response ", emailResponse)

                   return res.status(200).json({
                    success:true,
                    message:"Signature Verified Successfully!"
                   }) 
                   
                }

                catch(err){
                    
                    return res.status(500).json({
                     success:false,
                     message:"Failed! to verify Signature! "
                    }) 
                    
                }
            }
            
            else{
                
                return res.status(500).json({
                 success:false,
                 message:"Invalid Request! "
                }) 

    }
}
