const express = require("express");
const router = express.Router();
const testPaperController = require("../controllers/testPaper.controller");
const { authenticateUser } = require('../middlewares/auth.middleware');
const upload=require('../middlewares/multer')

//upload test paper
router.post("/",authenticateUser,upload.single('test-paper-pdf'),testPaperController.uploadTestPaper)


//get all paper pdf  by chapter
router.get('/:chapter_id',authenticateUser,testPaperController.getPaperPdfListByChapter)


//detele paper pdf
router.delete('/:testPaper_id',authenticateUser,testPaperController.deleteTestPaperPdf)


module.exports=router;