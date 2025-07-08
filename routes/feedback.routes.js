const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedback.controller");
const { authenticateUser } = require('../middlewares/auth.middleware');

//upload test paper
router.post('/', authenticateUser,feedbackController.addFeedback);

//get all quiz question  by chapter
router.get('/',authenticateUser,feedbackController.getAllFeedback)





module.exports=router;