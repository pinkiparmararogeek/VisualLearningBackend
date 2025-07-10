const Organization=require("../models/organization.model")
require('dotenv').config();

exports.addOrganization=async(req,res)=>{
    try{
        const{organization_name,address,email,phone,business_hours}=req.body;

        if(!organization_name||!address||!email||!phone||!business_hours){
            return res.status(400).json({status:false,message:"organization_name,address,email,phone,business_hours are require."})
        }


        const isOrganizationExist=await Organization.isOrganizationExist(organization_name)

        if(isOrganizationExist){
            return res.status(400).json({status:false,message:"This organization is already exist."})
        }
        const addOrganization=await Organization.addOrganization({organization_name,address,email,phone,business_hours})
        if(!addOrganization){
            return res.status(400).json({status:false,message:"Organization not added."})
        }
        return res.status(200).json({status:true,message:"Organization added successfully.",id:addOrganization})
    }catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}


exports.getOrganizationDetail=async(req,res)=>{
    try{
const getOrganizationDetail=await Organization.getOrganizationDetail()
if(!getOrganizationDetail){

    return res.status(400).json({status:false,message:"Organization not found."})
}
return res.status(200).json({status:true,message:"Organization detail found successfully.",data:getOrganizationDetail})

    }
    catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}

exports.uploadBannerImage = async(req, res) => {
    try{
const { title } = req.body;
  const imageUrl = req.file ? `${req.file.filename}` : null;
  if (!imageUrl || !title) {
    return res.status(400).json({ message: "Title and image are required" });
  }
const uploadBannerImage = await Organization.uploadImage({title,imageUrl})
if(!uploadBannerImage)
{
return res.status(400).json({status:false,message:"Banner image not uploaded."})
}
return res.status(200).json({status:true,message:"Banner image uploaded succesfully.",id:uploadBannerImage})
    }catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
};


exports.getBannerImages=async(req,res)=>{
    try{
const bannerImages=await Organization.bannerImagesList()
    if(!bannerImages){
      return res.status(400).json({status:false,message:"Banner images not found."})
    }
     const baseUrl2 = `${process.env.BASE_URL}/uploads/banner-images/`;
    const updatedBannerList = bannerImages.map(banner => ({
      ...banner,
      image_url: baseUrl2 + banner.image_url
    }));
return res.status(200).json({status:true,message:"Banner images found successfully.",data:updatedBannerList})
    }
    catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}


exports.deletebannerImage=async(req,res)=>{
    try{
const{image_id}=req.params;
const deleteBannerImage=await Organization.deleteBannerImage(image_id);
if(!deleteBannerImage){
    return res.status(400).json({status:false,message:"Banner image not deleted."})
}
return res.status(200).json({status:true,message:"Banner image deleted successfully."})
    } catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}