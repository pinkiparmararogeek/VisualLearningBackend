const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notespdf.controller");
const { authenticateUser } = require('../middlewares/auth.middleware');
const upload=require('../middlewares/multer')


//upload notes pfg by chapter
router.post("/",authenticateUser,  upload.single('pdf_url'),notesController.uploadNotesPdf)


//get all pdf list by chapter
router.get('/:chapter_id',authenticateUser,notesController.getNotesPdfListByChapter)


//detele noted pdf
router.delete('/:notes_id',authenticateUser,notesController.deleteNotesPdf)


//eit notes pdf
router.put('/:notes_id',authenticateUser,upload.single('pdf_url'),notesController.editNotes)
module.exports=router;