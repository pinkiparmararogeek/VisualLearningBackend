const User=require("../models/users.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY=process.env.JWT_SECRET;
const nodemailer = require('nodemailer');
require('dotenv').config();
const WelcomeEmail = require("../utils/emailTemplate");
exports.getUserList=async(req,res)=>{
    try{
const userList=await User.getUserList()
if(!userList){
    return res.status(400).json({status:false,message:"User list not found."})
}

return res.status(200).json({status:true,message:"User list found successfully",data:userList})
    }
    catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}


//user register funtion
exports.registerUser=async(req,res)=>{
    try{
        const{full_name,email,mobile,password,referral_code}=req.body;
        if(!full_name||!email||!mobile||!password){
            return res.status(400).json({status:false,message:"full_name,email,mobile,password are require"})
        }
         // Check if user already exists by email
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ status: false, message: "Email is already registered" });
    }
  // Hash the password
    const hashedPassword = await bcrypt.hash(String(password), 10);
      // Generate token
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || "mysecret",
      { expiresIn:process.env.EXPIRES_IN|| "7d" }
    );
        // Register the user
    const userId = await User.registerUser({
      full_name,
      mobile,
      email,
      referral_code,
      password: hashedPassword,
     jwt_token: token
    });
    if(!userId){
        return res.status(400).json({status:false,message:"User not registered."})
    }
    return res.status(201).json({
      status: true,
      message: "User registered successfully",
      data: {
        user_id: userId,
        full_name,
        email,
        mobile,
        is_subscribe:1,
        token
      },
    });
    }catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}


//user login function
exports.loginUser=async(req,res)=>{
    try{
        const{email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({status:false,message:"email and password require for login."})
        }
 // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ status: false, message: "Invalid email or password" });
    }
    // Compare passwords
    const isMatch = await bcrypt.compare(String(password), user.password);
    if (!isMatch) {
      return res.status(401).json({ status: false, message: "Invalid email or password" });
    }
    // Generate new token
    const token = jwt.sign(
      { user_id: user.user_id_PK, email: user.email },
      process.env.JWT_SECRET || "mysecret",
      { expiresIn: process.env.EXPIRES_IN ||"7d" }
    );

console.log(">>>>",token)
    const user_id=user.user_id_PK
    // Update token in DB
   const updateToken= await User.updateToken({user_id,token});
if(!updateToken){
    return res.status(400).json({status:false,message:"jwt_token not updated in db."})
}
return res.status(200).json({
      status: true,
      message: "Login successful",
      user: {
        user_id: user.user_id_PK,
        full_name: user.full_name,
        email: user.email,
        mobile: user.mobile,
        is_subscribe:user.is_subscribe,
        expiry_date:user.expiry_date,
        token:token
      }
    });
    }catch(err){
return res.status(500).json({status:false,message:err.message})
    }
}



//user google login
exports.googleLoginUser = async (req, res) => {
  try {
const { full_name, email, provider_id,signIn_method } = req.body;
if(!full_name||!email||!provider_id||!signIn_method){
  return res.status(400).json({status:false,mesage:"Full_name and email,provider_id,signIn_method are required."})
}
    // Check if user already exists
    const user = await User.findByEmail(email);
    // Generate token
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || "mysecret",
      { expiresIn: process.env.EXPIRES_IN || "7d" }
    );
    if (user) {
      // Update token for existing user
      const updateToken = await User.updateToken({ user_id: user.user_id_PK, token });
      if (!updateToken) {
        return res.status(400).json({ status: false, message: "jwt_token not updated in db." });
      }
      return res.status(200).json({
        status: true,
        message: 'Login successful.',
        user: {
          user_id: user.user_id_PK,
          full_name: user.full_name,
          email: user.email,
          mobile: user.mobile,
          is_subscribe:user.is_subscribe,
          expiry_date:user.expiry_date,
          token: token
        }
      });
    }
    // Register the user (no mobile in Google data, so set null)
    const userId = await User.registerUser({
      full_name,
      mobile:null,
      email,
      provider_id,
      signIn_method,
      jwt_token: token
    });
    if (!userId) {
      return res.status(400).json({ status: false, message: "User not registered." });
    }
    return res.status(200).json({
      status: true,
      message: 'Login successful',
      user: {
        user_id: userId, // this comes from your `registerUser()` return
        full_name: full_name,
        email,
        mobile: null,
        is_subscribe:user.is_subscribe,
        expiry_date:user.expiry_date,
        token: token
      }
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};




//Forgate Or Reset Password function
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
   
    if (!email) {
      return res.status(400).json({ status: false, message: "Email is required" });
    }
    const existingUser = await User.findByEmail(email);
    console.log("existingUser",existingUser)
    if (!existingUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
//Function for generate random password
    function generateRandomPassword(length = 8) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let password = '';
      for (let i = 0; i < length; i++) {
          password += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return password;
  }
  
  const randomPassword = generateRandomPassword();
  console.log("Generated Password:", randomPassword);

    // Hash the random password
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Update user's password in the database
    const userId = await User.updatePassword(email, hashedPassword);
    if (!userId) {
      return res.status(500).json({ status: false, message: "Failed to update password" });
    }
 
    // Generate JWT token
    const token = jwt.sign({ id: userId, email }, JWT_SECRET_KEY, { expiresIn: "7d" });
    console.log("Token:", token);
console.log("randomPassword",randomPassword)
console.log("existingUser.first_name",existingUser.full_name)

const capitalizeFirstLetter = (str) => {
 return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const fullName = capitalizeFirstLetter(existingUser.full_name);


    // Send email to user
   await sendUserForgetPasswordEmail(email, fullName, randomPassword);
    res.status(200).json({
      status: true,
      message: "Password reset successfully",
      id: userId,
    
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};



//Function to send Forget Password email
const sendUserForgetPasswordEmail = async (userEmail, userName, randomPassword) => {
  const emailHtml =await WelcomeEmail.resetPassEmailTemplate({ name: userName, email: userEmail,password: randomPassword })
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
       user: "serialcoder90@gmail.com",
      pass: "kojz escm eaxw chod",
      },
    });
    const mailOptions = {
      from: "serialcoder90@gmail.com",
      to: userEmail,
      subject: "Reset password mail",
      html: emailHtml,
    };
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to", userEmail);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
