const express = require("express");
const router = express.Router();
const classController = require("../controllers/classes.controller");
const { authenticateUser } = require('../middlewares/auth.middleware');

const multerErrorHandler = require("../middlewares/multerErrorHandler");

//API for get class List by category
router.get('/',authenticateUser,classController.getClassList)

//API for add new class
router.post("/",authenticateUser,multerErrorHandler,classController.addClass)


//delete class
router.delete("/:class_id",authenticateUser,classController.deleteClass);

//get all subject and chapters by Class name
router.get('/class-detail/:class_id',authenticateUser,classController.getSubjectsAndChaptersByClass )



//edit Class
router.put('/edit-class/:class_id',multerErrorHandler,classController.editClass);


//active-in-active class
router.post('/active-in-active',authenticateUser,classController.activeInactiveClass)
module.exports=router;