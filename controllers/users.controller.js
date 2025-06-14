const User=require("../models/users.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
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
        const{full_name,email,mobile,password}=req.body;

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
        token:token
      }
    });
    }catch(err){
return res.status(500).json({status:false,message:err.message})
    }
}

//forget password API

exports.forgotPassword = async (req, res) => {
  try {
    const { email,password } = req.body;
    if (!email||!password) {
      return res.status(400).json({ status: false, message: "email and password is required" });
    }
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(String(password), 10);
  const resetPassword=  await User.updatePassword(user.user_id_PK, hashedPassword);
if(!resetPassword){
    return res.status(400).json({status:false,message:"Password not reset."})
}
    return res.status(200).json({
      status: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};