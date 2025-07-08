const Feedback=require("../models/feedback.model");

exports.addFeedback=async(req,res)=>{

    try{
        const{full_name,feedback}=req.body;
        if(!full_name||!feedback){
            return res.status(400).json({status:false,message:"full_name and feedback are require."})
        }
        const addFeedback=await Feedback.addFeedback({full_name,feedback})
if(!addFeedback){
    return res.status(400).json({status:false,message:"Feedback not added."})
}
return res.status(200).json({status:true,message:"Feedback added successfully.",id:addFeedback})
    }catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}


exports.getAllFeedback=async(req,res)=>{
    try{

        const getAllFeedback=await Feedback.getAllFeedback()
        if(!getAllFeedback){
            return res.status(400).json({status:false,message:"No feedback found."})
        }
        return res.status(200).json({status:true,message:"All Feedback found successfully.",data:getAllFeedback})
    }catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}