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
module.exports=router;
