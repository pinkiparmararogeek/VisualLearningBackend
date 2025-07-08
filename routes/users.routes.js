const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controller");
const { authenticateUser } = require('../middlewares/auth.middleware');

router.get('/',authenticateUser,userController.getUserList)

//user register API
router.post('/register', userController.registerUser);


//user login API
router.post('/login', userController.loginUser);



//user google login
router.post('/google-login',userController.googleLoginUser)

//forget password API
router.post('/forgot-password', userController.forgotPassword);

// user logout API
router.post("/logout",userController.logoutUser)


//add or edit fcm_token of user
router.post("/fcm-token-user",authenticateUser,userController.AddFcmTokenUser)



//testing firebase notification
router.post("/notification",userController.sendNotification)


//get notification list
router.get('/notification-list',userController.getNotificationList)
module.exports=router;
