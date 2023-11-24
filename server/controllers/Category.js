const Category = require('../models/Category');

exports.createCategory = async (req,res)=>{

    try{

        const {name, description} = req.body;
        
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required!"
            })
        }

        //create an entry in Tag Model
        const tagDetails = await Category.create({
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

exports.getAllCategory = async (req,res)=>{

    try{
        const allTags = await Category.find({}, {name:true,description:true});

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


//get category details to display 

exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
      console.log("PRINTING CATEGORY ID: ", categoryId);
      // Get courses for the specified category
      const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: "ratingAndReviews",
        })
        .exec()
  
      //console.log("SELECTED COURSE", selectedCategory)
      // Handle the case when the category is not found
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      // Handle the case when there are no courses
      if (selectedCategory.courses.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }
  
      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec()
        //console.log("Different COURSE", differentCategory)
      // Get top-selling courses across all categories
      const allCategories = await Category.find()
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: {
            path: "instructor",
        },
        })
        .exec()
      const allCourses = allCategories.flatMap((category) => category.courses)
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
       // console.log("mostSellingCourses COURSE", mostSellingCourses)
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }