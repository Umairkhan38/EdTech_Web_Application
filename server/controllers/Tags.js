const Tags = require('../models/Tags');

exports.createTag = async (req,res)=>{

    try{

        const {name, description} = req.body;
        
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required!"
            })
        }

        //create an entry in Tag Model
        const tagDetails = await Tags.create({
            name,description
        })      

        console.log(tagDetails);

        // return successfull response
        res.status(201).json({
            success:true,
            message:"Tag Created Successfully!!"
        })

    }
    catch(err){

        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}


//get All tags

exports.getAllTags = async (req,res)=>{

    try{
        const allTags = await Tags.find({}, {name:true,description:true});

         res.status(200).json({
            success:false,
            message:"all tags fetched successfully",
            allTags
        })
        
    }catch(err){

        return res.status(500).json({
            success:false,
            message:err.message
        })

    }

}