const express = require("express");
const router = express.Router();
const chapterController = require("../controllers/chapter.controller");
const { authenticateUser } = require('../middlewares/auth.middleware');


 //API for add subject by class id
 router.post('/',authenticateUser,chapterController.addChapterBySubject)

// //API for add new class
// router.post("/",authenticateUser,classController.addClass)


//delete chapter
 router.delete("/:chapter_id",authenticateUser,chapterController.deleteChapter);



module.exports=router;