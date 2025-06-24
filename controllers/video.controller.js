const Video=require('../models/video.model');
require("dotenv").config();

exports.uploadVideo = async (req, res) => {
  try {
    const { chapter_id, video_title, description, duration, video_type, video } = req.body;
    const files = req.files;

    if (!chapter_id || !video_title || !video_type) {
      return res.status(400).json({ message: 'chapter_id, video_title, and video_type are required' });
    }
    const isVideoExist = await Video.isVideoxist({ chapter_id, video_title });
    if (isVideoExist) {
      return res.status(400).json({ status: false, message: "This video_title already exists for this chapter." });
    }

    let video_url = null;
    let thumbnail_url = files?.thumbnail ? `${files.thumbnail[0].filename}` : null;

   if (video_type == '1') { // Upload
  if (!files || !files.video) {
    return res.status(400).json({ message: 'Video file is required when video_type is 1 (upload)' });
  }
  video_url = `${files.video[0].filename}`;
} else if (video_type == '2') { // YouTube
  if (!video) {
    return res.status(400).json({ message: 'YouTube URL is required when video_type is 2 (YouTube)' });
  }
  video_url = video;
} else {
  return res.status(400).json({ message: 'Invalid video_type. Must be 1 (upload) or 2 (YouTube)' });
}

    const uploadVideo = await Video.uploadVideo({
      chapter_id,
      video_title,
      video_url,
      description,
      thumbnail_url,
      duration,
      video_type 
    });

    if (!uploadVideo) {
      return res.status(400).json({ status: false, message: "Video not uploaded." });
    }

    res.status(201).json({ message: 'Video uploaded successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.videoListByChapter=async(req,res)=>{
  try{
const{chapter_id}=req.params;
const getVideoListByChapter=await Video.getVideoList(chapter_id)
if(!chapter_id){
  return res.status(400).json({status:false,message:"There is no video uploaded for this chapter"})
}


const baseVideoUrl = `${process.env.BASE_URL}/uploads/videos/`;
const baseThumbnailUrl = `${process.env.BASE_URL}/uploads/thumbnails/`;

const updatedList = getVideoListByChapter.map(video => ({
  ...video,
  video_url:
    video.video_type == 1
      ? baseVideoUrl + video.video_url
      : video.video_url, 
  thumbnail_url: video.thumbnail_url
    ? baseThumbnailUrl + video.thumbnail_url
    : null
}));




  return res.status(200).json({status:true,message:"VIdeo list found successfully.",data:updatedList});
  }
  catch(err){
return res.status(500).json({status:false,message:err.message})
  }
}

exports.deleteVideo = async (req, res) => {
  try {
    const { video_id } = req.params;
    console.log("Deleting video_id:", video_id);
    const deleteVideo = await Video.deleteVideo(video_id);
    console.log("Delete result:", deleteVideo);
    if (!deleteVideo) {
      return res.status(400).json({
        status: false,
        message: "No video exists for this video ID or it was already deleted."
      });
    }
    return res.status(200).json({
      status: true,
      message: "Video deleted successfully."
    });
  } catch (err) {
    console.error("Error in deleteVideo:", err);
    return res.status(500).json({
      status: false,
      message: err.message
    });
  }
};
