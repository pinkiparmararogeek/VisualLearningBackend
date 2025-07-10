const express = require("express");
const router = express.Router();
const videoController = require("../controllers/video.controller");
const { authenticateUser } = require('../middlewares/auth.middleware');
const upload=require('../middlewares/multer')

//Upload video by chapter name
router.post('/upload-video',authenticateUser, upload.fields([
  { name: 'video_hindi', maxCount: 1 },
  { name: 'video_english', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), videoController.uploadVideo);
//get all video list by chapter 
router.get('/:chapter_id',authenticateUser,videoController.videoListByChapter)
//get all video list by chapter  and user id
router.get('/video-list/:chapter_id',authenticateUser,videoController.videoListByChapterAndUserId)
//delete video API
router.delete("/:video_id",authenticateUser,videoController.deleteVideo)
//Upload video by chapter name
router.put('/update-video/:video_id',authenticateUser,upload.fields([
  { name:'video_hindi', maxCount: 1 },
  { name:'video_english', maxCount: 1 },
  { name:'thumbnail', maxCount: 1 }
]), videoController.editVideo);
//search APi
router.post("/search", authenticateUser,videoController.searchContent);
module.exports=router;