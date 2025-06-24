const express = require("express");
const router = express.Router();
const subscriptionPlanController = require("../controllers/subscriptionPlan.controller");
const { authenticateUser } = require('../middlewares/auth.middleware');

//upload test paper
router.post('/',authenticateUser,subscriptionPlanController.addPlan);

// //get all quiz question  by chapter
// router.get('/',authenticateUser,feedbackController.getAllFeedback)





module.exports=router;