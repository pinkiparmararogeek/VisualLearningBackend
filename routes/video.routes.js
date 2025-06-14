const express = require("express");
const router = express.Router();
const videoController = require("../controllers/video.controller");
const { authenticateUser } = require('../middlewares/auth.middleware');
const upload=require('../middlewares/multer')

//Upload video by chapter name
router.post('/upload-video', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), videoController.uploadVideo);


module.exports=router;