const Category=require('../models/category.model')


exports.getCategoryList=async(req,res)=>{
    try{
        const getCategoryList=await Category.getCategoryList()

        if(!getCategoryList){
            return res.status(400).json({status:false,message:"Category list not found."});
        }
        return res.status(200).json({status:true,message:"Category list founded successfully.",Categories:getCategoryList})
    }catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}

exports.addCategory=async(req,res)=>{
    try{
        const{category_name,category_icon}=req.body;
        if(!category_name||!category_icon){
            return res.status(400).json({status:false,message:"category_name and category_icon is required."})
        }
     // Check if category already exists by name
    const existingCategory = await Category.findByName(category_name);
    if (existingCategory) {
      return res.status(400).json({ status: false, message: "This category is already exist" });
    }
        const addCategory=await Category.addCategory({category_name,category_icon})
        if(!addCategory){
            return res.status(400).json({status:false,message:"Category not added."})
        }
        return res.status(200).json({status:true,message:"Category added successfully."})
    }catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}


exports.deleteCategory=async(req,res)=>{
    try{
        const {id}=req.params;
        const daleteCategory=await Category.deleteCategory(id)
            if(!daleteCategory){
                return res.status(400).json({status:false,message:"Category not found or already deleted."})
            }
          return res.status(200).json({
      status: true,
      message: "Category deleted successfully.",
    });
    }catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}