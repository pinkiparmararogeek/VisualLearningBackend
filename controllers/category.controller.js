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

    const bannerImages=await Category.bannerImagesList()

    if(!bannerImages){
      return res.status(400).json({status:false,message:"Banner images not found."})
    }


     const baseUrl2 = `${process.env.BASE_URL}/uploads/banner-images/`;
    const updatedBannerList = bannerImages.map(banner => ({
      ...banner,
      image_url: baseUrl2 + banner.image_url
    }));

    return res.status(200).json({
      status: true,
      message: "Category list founded successfully.",
      Categories: updatedList,
      BannerImages:updatedBannerList
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

