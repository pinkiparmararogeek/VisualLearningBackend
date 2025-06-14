const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjects.controller");
const { authenticateUser } = require('../middlewares/auth.middleware');


//API for get subject List by class name
 router.get('/:class_name',subjectController.getSubjectsByClassName)

//Add new subject with class_id
router.post("/",subjectController.addSubject)

//delete subject
router.delete("/:subject_id",subjectController.deleteSubject)





module.exports=router;