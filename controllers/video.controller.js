const Video=require('../models/video.model');


exports.uploadVideo = async (req, res) => {
  try {
    const { chapter_id, video_title, description, duration } = req.body;
    const files = req.files;

    if (!chapter_id || !video_title || !files || !files.video) {
      return res.status(400).json({ message: 'chapter_id, video_title, and video file are required' });
    }

    const video_url = `/uploads/videos/${files.video[0].filename}`;
    const thumbnail_url = files.thumbnail ? `/uploads/thumbnails/${files.thumbnail[0].filename}` : null;


    const uploadVideo=await Video.uploadVideo({chapter_id, video_title, video_url, description, thumbnail_url, duration });
    if(!uploadVideo){
        return res.status(400).json({status:false,message:"Video not uploaded."})
    }
    
    res.status(201).json({ message: 'Video uploaded successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
