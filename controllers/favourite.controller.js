const Favourite=require('../models/favourite.model');
require('dotenv').config();


exports.markFavourite=async(req,res)=>{
    try{
const{user_id ,video_id}=req.body;

if(!user_id||!video_id){
    return res.status(400).json({status:"false",message:"user_id and video_id is required."})
}
const isAlreadyFavorite=await  Favourite.isFavouriteExist(user_id ,video_id);
if(isAlreadyFavorite){
    return res.status(400).json({status:false,message:"This video is alredy marked as a favourite."})
}
const markFavorite=await  Favourite.markFavourite(user_id ,video_id);
if(!markFavorite){
    return res.status(400).json({status:false,message:"Video not marked as a favourite."})
}

return res.status(200).json({status:true,message:"Video marked as a favourite."})
    }catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}


exports.removeFavourite=async(req,res)=>{
    try{
const{user_id ,video_id}=req.body;
if(!user_id||!video_id){
    return res.status(400).json({status:"false",message:"user_id and video_id is required."})
}
const removeFavorite=await  Favourite.removeFavourite(user_id ,video_id);
if(!removeFavorite){
    return res.status(400).json({status:false,message:"Video not removed from favourite list."})
}

return res.status(200).json({status:true,message:"Video removed from favourite list."})
    }catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}

exports.getFavouriteVideosByUserId=async(req,res)=>{
    try{
        const{user_id}=req.params;
        const getFavouriteList=await Favourite.getFavouriteVideoListByUserId(user_id);

        if(!getFavouriteList){
            return res.status(400).json({status:false,message:"There is no favourite video for this user."})
        }

const baseVideoUrl = `${process.env.BASE_URL}/uploads/videos/`;
const baseThumbnailUrl = `${process.env.BASE_URL}/uploads/thumbnails/`;

const updatedList = getFavouriteList.map(video => ({
  ...video,
  video_url_hindi:
    video.video_type == 1
      ? baseVideoUrl + video.video_url_hindi
      : video.video_url_hindi, 
       video_url_english:
    video.video_type == 1
      ? baseVideoUrl + video.video_url_english
      : video.video_url_english, 
  thumbnail_url: video.thumbnail_url
    ? baseThumbnailUrl + video.thumbnail_url
    : null
}));




        return res.status(200).json({status:true,message:"Favorite video list found successfully.",data:updatedList})
    }catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}