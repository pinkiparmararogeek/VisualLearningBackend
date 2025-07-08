const express = require("express");
const router = express.Router();
const subscriptionPlanController = require("../controllers/subscriptionPlan.controller");
const { authenticateUser } = require('../middlewares/auth.middleware');

//add new subscription plan
router.post('/',authenticateUser,subscriptionPlanController.addPlan);

//get all active plans  by chapter
router.get('/',authenticateUser,subscriptionPlanController.getAllPlans)




//get all active plans  by chapter
router.get('/plan-list',authenticateUser,subscriptionPlanController.getPlansList)
//purchase plan
router.post('/purchase-plan',authenticateUser,subscriptionPlanController.purchasePlan)

//get user subscription detail
router.get("/user-subcription/:user_id",authenticateUser,subscriptionPlanController.getUserSUbscriptionDetail)


//gel all subscription list
router.get("/subscription-list",authenticateUser,subscriptionPlanController.getSubscriptionList)

//active,in-active plan
router.post("/active-in-active",authenticateUser,subscriptionPlanController.planActiveInActive)
module.exports=router;