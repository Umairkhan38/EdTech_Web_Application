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
