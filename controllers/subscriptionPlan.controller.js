const  SubscriptionPlan=require("../models/subscriptionPlan.model")


exports.addPlan=async(req,res)=>{
    try{
const{plan_name,price,offer_price,duration_days	}=req.body;
if(!plan_name||!price||!duration_days){
    return res.status(400).json({status:false,message:"plan_name,price,duration_days are required."})
}
const isPlanExist=await SubscriptionPlan.isPlanExist(plan_name)
if(isPlanExist)
{
    return res.status(400).json({status:false,message:"A plan with this name already exists. Please use a unique plan name."})
}
const addPlan=await SubscriptionPlan.addPlan({plan_name,price,offer_price,duration_days	})
if(!addPlan){
    return res.status(400).json({status:false,message:"Subscription plan not added."})
}
return res.status(201).json({status:true,message:"Subscription plan added successfully.",id:addPlan})
    }
    catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}