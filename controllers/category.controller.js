const Category=require('../models/category.model')
require('dotenv').config();

exports.getCategoryList=async(req,res)=>{
    try{
        const getCategoryList=await Category.getCategoryList()
        if(!getCategoryList){
            return res.status(400).json({status:false,message:"Category list not found."});
        }
        // Use environment variable
    const baseUrl = `${process.env.BASE_URL}/uploads/icons/`;
    const updatedList = getCategoryList.map(category => ({
      ...category,
      category_icon: baseUrl + category.category_icon
    }));
    return res.status(200).json({
      status: true,
      message: "Category list founded successfully.",
      Categories: updatedList
    });
    }catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}

exports.addCategory = async (req, res) => {
  try {
    const { category_name } = req.body;
    const icon = req.file?.filename;

    if (!category_name || !icon) {
      return res.status(400).json({
        status: false,
        message: "category_name and category_icon are required."
      });
    }

    // Check if category already exists by name
    const existingCategory = await Category.findByName(category_name);
    if (existingCategory) {
      return res.status(400).json({
        status: false,
        message: "This category already exists"
      });
    }

    const addCategory = await Category.addCategory({ category_name, icon });
    if (!addCategory) {
      return res.status(400).json({
        status: false,
        message: "Category not added."
      });
    }

    return res.status(200).json({
      status: true,
      message: "Category added successfully."
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message
    });
  }
};


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