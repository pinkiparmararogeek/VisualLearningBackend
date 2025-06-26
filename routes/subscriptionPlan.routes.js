const express = require("express");
const router = express.Router();
const subscriptionPlanController = require("../controllers/subscriptionPlan.controller");
const { authenticateUser } = require('../middlewares/auth.middleware');

//upload test paper
router.post('/',authenticateUser,subscriptionPlanController.addPlan);

//get all quiz question  by chapter
router.get('/',authenticateUser,subscriptionPlanController.getAllPlans)

//purchase plan
router.post('/purchase-plan',authenticateUser,subscriptionPlanController.purchasePlan)

//get user subscription detail
router.get("/user-subcription/:user_id",authenticateUser,subscriptionPlanController.getUserSUbscriptionDetail)


//gel all subscription list
router.get("/subscription-list",authenticateUser,subscriptionPlanController.getSubscriptionList)
module.exports=router;