const Video=require('../models/video.model');
require("dotenv").config();


const admin=require('../database/firebase')



const sendNotification = async (topic,className,subjectName,chapterName, video_title, body,title,data) => {
  if (!topic) {
    console.error("FCM topic is missing");
    return false;
  }

  const message = {
    topic: topic,
    notification: {
      title,
      body,
    },
    data: {
        class:className,
        subjectname:subjectName,
        chaptername:chapterName,
        titlt:video_title
    }
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent:", response);
    return true;
  } catch (error) {
    console.error("Error sending notification:", error.message || error);
    return false;
  }
};




exports.uploadVideo = async (req, res) => {
  try {
    const { chapter_id, video_title, description, duration, video_type, is_paid ,topic} = req.body;
    const files = req.files;

    if (!chapter_id || !video_title || !video_type) {
      return res.status(400).json({
        message: 'chapter_id, video_title, and video_type are required'
      });
    }
    const isVideoExist = await Video.isVideoxist({ chapter_id, video_title });
    if (isVideoExist) {
      return res.status(400).json({
        status: false,
        message: "This video title already exists for this chapter."
      });
    }
    const thumbnail_url = files?.thumbnail ? files.thumbnail[0].filename : null;
    let video_hindi = null;
    let video_english = null;
    // === Strict Validation ===
    if (video_type == '1') {
      // Expect video files only
      if (!files?.video_hindi && !files?.video_english) {
        return res.status(400).json({
          status: false,
          message: 'Please upload at least one video: video hindi or video english.'
        });
      }
      // Check if YouTube URLs were mistakenly sent
      if (req.body.video_hindi?.startsWith('http') || req.body.video_english?.startsWith('http')) {
        return res.status(400).json({
          status: false,
          message: 'YouTube URLs are not allowed when video type is uploaded video. Please upload files.'
        });
      }
      video_hindi = files?.video_hindi?.[0]?.filename || null;
      video_english = files?.video_english?.[0]?.filename || null;

    } else if (video_type == '2') {
      // Expect YouTube URLs only
      if (!req.body.video_hindi && !req.body.video_english) {
        return res.status(400).json({
          status: false,
          message: 'At least one YouTube URL (video hindi or video english) is required.'
        });
      }

      // Check if files were mistakenly uploaded
      if (files?.video_hindi || files?.video_english) {
        return res.status(400).json({
          status: false,
          message: 'Video files are not allowed when video type is youtube url. Please provide YouTube URLs.'
        });
      }

      video_hindi = req.body.video_hindi;
      video_english = req.body.video_english;

    } else {
      return res.status(400).json({
        message: 'Invalid video type. Must be 1 (upload) or 2 (YouTube)'
      });
    }

    // === Save Video ===
    const uploadVideo = await Video.uploadVideo({
      chapter_id,
      video_title,
      video_hindi,
      video_english,
      description,
      thumbnail_url,
      duration,
      video_type,
      is_paid
    });

    if (!uploadVideo) {
      return res.status(400).json({ status: false, message: "Video not uploaded." });
    }




//firebase notification start
const getChapter=await Video.getChapterById(chapter_id);
if(!getChapter){
    return res.status(400).json({status:false,message:"Chapter not found for this chapter_id."})
}
const chapterName=getChapter.chapter_name;
console.log("chapterName>>>",chapterName)
const subjectId=getChapter.subject_id_FK;


const getSubject=await Video.getSubjectById(subjectId);
if(!getSubject){
    return res.status(400).json({status:false,message:"Subject not found for this subject id."})
}
const subjectName=getSubject.subject_name;
console.log("subjectName>>>",subjectName)
const classId=getSubject.class_id_FK;
const getClass=await Video.getClassById(classId);

if(!getClass){
    return res.status(400).json({status:false,message:"Class not found for this class_id."})
}

const className=getClass.class_name;
console.log("className>>>",className)
const title = `New Notes Added: ${video_title}`;
const body = `${className} > ${subjectName} > ${chapterName} - A new PDF titled "${video_title}" has been uploaded.`;

const notification = await sendNotification(
  topic,
  className,
  subjectName,
  chapterName,
  video_title,
  title,
  body
);

if(!notification){
    return res.status(400).json({status:false,message:"Notification not send to users."})
}

const addNotificationInDb=await Video.adNotifictionInDb({className,subjectName,chapterName,video_title});

if(!addNotificationInDb){
    return res.status(400).json({status:false,message:"Notification detail not saved in database."})
}
//firebase notification ends

    res.status(201).json({ status: true, message: 'Video uploaded successfully' });

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




  return res.status(200).json({status:true,message:"VIdeo list found successfully.",data:updatedList});
  }
  catch(err){
return res.status(500).json({status:false,message:err.message})
  }
}


exports.videoListByChapterAndUserId = async (req, res) => {
  try {
    const { chapter_id } = req.params;
    const { user_id } = req.query;
    if (!chapter_id) {
      return res.status(400).json({ status: false, message: "Chapter ID is required." });
    }
    const getVideoListByChapter = await Video.getVideoList(chapter_id);
    let favouriteVideoIds = [];
    if (user_id) {
      favouriteVideoIds = await Video.getFavouriteVideoIdsByUser(user_id);
    }
    const baseVideoUrl = `${process.env.BASE_URL}/uploads/videos/`;
    const baseThumbnailUrl = `${process.env.BASE_URL}/uploads/thumbnails/`;
    const updatedList = getVideoListByChapter.map(video => ({
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
        : null,
      is_favourite: favouriteVideoIds.includes(video.video_id_PK) ? 1 : 0
    }));
    return res.status(200).json({
      status: true,
      message: "Video list found successfully.",
      data: updatedList
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};


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

exports.editVideo = async (req, res) => {
  try {
    const { video_id } = req.params;
    const { chapter_id, video_title, description, duration, is_paid, video_hindi: body_video_hindi, video_english: body_video_english } = req.body;
    const files = req.files;

    const getVideoById = await Video.getVideoById(video_id);
    if (!getVideoById) {
      return res.status(400).json({ status: false, message: "Video not found." });
    }

    // === Duplicate Check ===
    const duplicateVideoTitle = await Video.duplicateVideoTitele({
      video_id,
      video_title,
      chapter_id
    });
    if (duplicateVideoTitle) {
      return res.status(400).json({
        status: false,
        message: "This video title already exists for this chapter."
      });
    }

    // === Prepare Thumbnail ===
    const thumbnail_url = files?.thumbnail ? files.thumbnail[0].filename : getVideoById.thumbnail_url;

    // === Handle video fields ===
    let video_hindi = files?.video_hindi ? files.video_hindi[0].filename : getVideoById.video_url_hindi;
    let video_english =  files?.video_english ? files.video_english[0].filename : getVideoById.video_url_english;;
    // === Perform Update ===
    const updateVideo = await Video.updateVideo({
      video_id,
      chapter_id_FK: getVideoById.chapter_id_FK,
      video_title: video_title || getVideoById.video_title,
      video_hindi,
      video_english,
      description: description || getVideoById.description,
      thumbnail_url,
      duration: duration || getVideoById.duration,
      video_type:getVideoById.video_type,
      is_paid: is_paid || getVideoById.is_paid
    });

    if (!updateVideo) {
      return res.status(400).json({ status: false, message: "Video not updated." });
    }

    return res.status(200).json({ status: true, message: "Video updated successfully." });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: err.message });
  }
};



exports.searchContent = async (req, res) => {
  const { keyword } = req.body;
  if (!keyword) {
    return res.status(400).json({ status: false, message: "Keyword is required" });
  }

  try {
    const query = `${keyword}%`; 

    const videos=await Video.getSearchVideo(query)
   

const baseVideoUrl = `${process.env.BASE_URL}/uploads/videos/`;
    const baseThumbnailUrl = `${process.env.BASE_URL}/uploads/thumbnails/`;
    const updatedVideos = videos.map(video => ({
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



const notes=await  Video.getSearchNotes(query)

const baseUrl = `${process.env.BASE_URL}/uploads/notes/`;
    const updatednotes = notes.map(notes => ({
      ...notes,
      pdf_url: baseUrl + notes.pdf_url
    }));
   const testPapers=await Video.getSearchTestPaper(query)

 
    const updatedTestPaper = testPapers.map(testPaper => ({
      ...testPaper,
      pdf_url: baseUrl + testPaper.pdf_url
    }));
   
   const quizzes=await Video.getSearchQuiz(query)
    

    return res.json({
      status: true,
      message: "Search results fetched successfully.",
      data: {
        VideoList:updatedVideos,
        notesList:updatednotes,
        testPaperList:updatedTestPaper,
        quiList:quizzes,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};