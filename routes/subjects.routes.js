const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjects.controller");
const { authenticateUser } = require('../middlewares/auth.middleware');


//API for get subject List by class name
 router.get('/:class_name',authenticateUser,subjectController.getSubjectsByClassName)

//Add new subject with class_id
router.post("/",authenticateUser,subjectController.addSubject)

//delete subject
router.delete("/:subject_id",authenticateUser,subjectController.deleteSubject)





module.exports=router;