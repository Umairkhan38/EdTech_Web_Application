const jwt = require('jsonwebtoken');
require("dotenv").config();
const User = require("../models/User");

exports.auth=(req,res,next)=>{

try{
    
    //extract token
    const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","");

    if(!token){
        return res.status(401).json({
            successs:false,
            message:"token is missing"
        })
    }

    //verify the token
     try{
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decode);
        req.user =decode;
     }  
     catch(err){
           return res.status(401).status({
            success:false,
            message:"token is invalid"
           }) 
     } 

}catch(err){

    return res.status(401).json({
        success:false,
        message:"something went wrong while validating the token!"
    })

}

}


//isStudent
exports.isStudent = async (req,res,next)=>{

    try{
        if(req.user.accountType!=="Student"){
            return res.status(401).json({
                success:false,
                message:"this is a protected route for student"
            })
        }
        next()
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"user role can't be verified"
        })
    }
}



//isInstrctor 
exports.isInstructor = async (req,res,next)=>{

    try{
        if(req.user.accountType!=="Instructor"){
            return res.status(401).json({
                success:false,
                message:"this is a protected route for student"
            })
        }
        next()

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"user role can't be verified"
        })
    }
}



//isAdmin 
exports.isAdmin = async (req,res,next)=>{

    try{
        if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"this is a protected route for student"
            })
        }
        next()

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"user role can't be verified"
        })
    }
}
