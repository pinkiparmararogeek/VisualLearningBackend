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



exports.getAllPlans=async(req,res)=>{
try{

    const getAllPlans=await  SubscriptionPlan.getAllPlans()
    if(!getAllPlans){
        return res.status(400).json({status:false,mesage:"No Subscription Plan found."})
    }
    return res.status(200).json({status:true,message:"Subscription plan list found sucessfully.",data:getAllPlans});

}catch(err){
    return res.status(500).json({status:false,message:err.message})
}
}



exports.purchasePlan=async(req,res)=>{
    try{
        const{plan_id,user_id}=req.body;

if(!plan_id||!user_id){
    return res.status(400).json({status:false,message:"plan_id and user_id is required to purchase plan."})
}


const getPlanById=await SubscriptionPlan.getPlanById(plan_id);
if(!getPlanById){
    return res.status(400).json({status:false,message:"There is no subscription plan available for this plan id."})
}


 // 2. Get today's date
    const startDate = new Date();
console.log("startDate>>>",startDate);


    // 3. Calculate end date
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + getPlanById.duration_days);

const purchasePlan=await  SubscriptionPlan.purchasePlan({plan_id,user_id,startDate,endDate})
if(!purchasePlan){
    return res.status(400).json({status:false,message:"Subscription plan not purchased."})
}

return res.status(200).json({status:true,message:"Subscription plan purchased successfully.",data:purchasePlan})
    }catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}


exports.getUserSUbscriptionDetail=async(req,res)=>{
    try{
        const{user_id}=req.params;
        const getUserSubscriptionDetail=await SubscriptionPlan.getUserSubscriptionDetail(user_id);

        if(!getUserSubscriptionDetail){
            return res.status(400).json({status:false,message:"User subscription detail not found."})
        }

    return res.status(200).json({status:true,message:"User subscription detail found successfully",data:getUserSubscriptionDetail})
    }catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}







async function handleExpiredSubscriptions() {
    const today = new Date().toISOString().slice(0, 10);
    const users = await SubscriptionPlan.getUsersWithExpiryToday(today);
    if (users.length === 0) {
      return { message: 'No expiring subscriptions today' };
    }
    for (const user of users) {
      const userId = user.user_id_PK;
       try {
    await SubscriptionPlan.updateUserSubscriptionStatus(userId, today);
    await SubscriptionPlan.deactivateUserSubscription(userId, today);
  } catch (err) {
    console.error(`Failed to update subscription for user ${userId}:`, err);
  }
    }
      console.log("Subscriptions status updated successfully")
    return {
      message: 'Subscriptions status updated successfully',
      total: users.length,
    };
   
  }



// Run once on server start
  handleExpiredSubscriptions();
  
  // Repeat every 24 hours
  setInterval(handleExpiredSubscriptions, 24 * 60 * 60 * 1000);



  exports.getSubscriptionList=async(req,res)=>{
    try{
        const getSubscriptionList=await SubscriptionPlan.getSubscriptionList()
        if(!getSubscriptionList){
            return res.status(400).json({status:false,message:"Subscription plan list not found."})
        }
        return res.status(200).json({status:true,message:"Subscription plan list found successfully.",data:getSubscriptionList})
    }catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
  }