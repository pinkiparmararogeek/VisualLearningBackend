const express = require("express");
const router = express.Router();
const classController = require("../controllers/classes.controller");
const { authenticateUser } = require('../middlewares/auth.middleware');

const multerErrorHandler = require("../middlewares/multerErrorHandler");
//API for get class List by category
router.get('/:category_id',authenticateUser,classController.getClassesByCategory)

//API for add new class
router.post("/",authenticateUser,multerErrorHandler,classController.addClass)


//delete class
router.delete("/:class_id",authenticateUser,classController.deleteClass);

//get all subject and chapters by Class name
router.get('/class-detail/:class_name',authenticateUser,classController.getSubjectsAndChaptersByClass )

module.exports=router;