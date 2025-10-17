const  SubscriptionPlan=require("../models/subscriptionPlan.model")
const Razorpay = require("razorpay");
const User=require("../models/users.model")
exports.addPlan=async(req,res)=>{
    try{
const{plan_name,price,offer_price,validity_unit,validity_count	}=req.body;

// Required field check
if (!plan_name || !price || !validity_unit||!validity_count) {
  return res.status(400).json({
    status: false,
    message: "plan_name, price, and validity_unit,validity_count are required.",
  });
}

// Validate price
if (isNaN(price) || Number(price) <= 0) {
  return res.status(400).json({
    status: false,
    message: "Please enter a valid amount for price.",
  });
}

// Validate offer_price (only if it's provided)
if (offer_price) {
  if (isNaN(offer_price) || Number(offer_price) <= 0) {
    return res.status(400).json({
      status: false,
      message: "Please enter a valid offer price.",
    });
  }

  if (Number(offer_price) >= Number(price)) {
    return res.status(400).json({
      status: false,
      message: "Offer price must be less than price.",
    });
  }
}



const isPlanExist=await SubscriptionPlan.isPlanExist(plan_name)
if(isPlanExist)
{
    return res.status(400).json({status:false,message:"A plan with this name already exists. Please use a unique plan name."})
}
const addPlan=await SubscriptionPlan.addPlan({plan_name,price,offer_price,validity_unit	,validity_count})
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



exports.getPlansList=async(req,res)=>{
try{

    const getPlanList=await  SubscriptionPlan.getPlanList()
    if(!getPlanList){
        return res.status(400).json({status:false,mesage:"No Subscription Plan found."})
    }
    return res.status(200).json({status:true,message:"Subscription plan list found sucessfully.",data:getPlanList});

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

    switch (getPlanById.validity_unit) {
      case 1: // days
        endDate.setDate(endDate.getDate() + getPlanById.validity_count);
        break;
      case 2: // months
        endDate.setMonth(endDate.getMonth() + getPlanById.validity_count);
        break;
      case 3: // years
        endDate.setFullYear(endDate.getFullYear() + getPlanById.validity_count);
        break;
      default:
        return res.status(400).json({
          status: false,
          message: "Invalid validity unit for this plan.",
        });
    }

    console.log("endDate>>>",endDate);
const purchasePlan=await  SubscriptionPlan.purchasePlan({plan_id,user_id,startDate,endDate})
if(!purchasePlan){
    return res.status(400).json({status:false,message:"Subscription plan not purchased."})
}


  // Get the referred_by_Id for the current user
    const user = await User.getUserById(user_id); // You should have a function like this
    if (!user ) {
      return res.status(400).json({status:true,message:"User detail not found."})
  }

      const referredUser =user.referred_by_Id;
      console.log('user.referred_by_Id>>>>>>',referredUser)
  
    if (user.referred_by_Id) {
      const extendSuccess = await User.extendSubscriptionPlanAfterPlanPurchase(user.referred_by_Id);

      if (!extendSuccess) {
        return res.status(400).json({
          status: false,
          message: "Referred user's expiry date not extended.",
        });
      }
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


  exports.planActiveInActive=async(req,res)=>{
    try{
      const{plan_id,status}=req.body;
  if (![1, 2].includes(Number(status))) {
    return res.status(400).json({ message: "Invalid status. Use 1 for active, 2 for inactive." });
  }
 const result = await SubscriptionPlan.updateSubscriptionStatus(plan_id, status);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    return res.status(200).json({status:true,
      message: `Subscription plan has been ${status == 1 ? "Activated" : "In-activated"}.`
    });


    }catch(err){
      return res.status(500).json({status:false,message:err.message});
    }
  }


  exports.cancelPlanByUser = async (req, res) => {
    try {
        const user_id= req.params.id;
     
        const cancelPlanByUser = await SubscriptionPlan.cancelPlanByUser(user_id);

        if (!cancelPlanByUser) {
            return res.status(400).json({ status: false, message: "Subscription plan expired or cancelled alredy." });
        }

        return res.status(200).json({ status: true, message: "Subscription plan cancelled successfully.", data: cancelPlanByUser });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}






exports.generateOrderId = async (req, res) => {
  try {
    const {amount } = req.body;



    if (!amount ) {
      return res
        .status(400)
        .json({ status: false, message: "amount are required." });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

const options = {
  amount: amount * 100, // convert ₹ to paise
  currency: "INR",
  receipt: "receipt_" + Date.now(),
};
    const order = await instance.orders.create(options);

    if (!order) {
      return res.status(500).json({ status: false, message: "Failed to create order." });
    }

    return res.status(200).json({
      status: true,
      message: "Order created successfully.",
      data: order,
    });
  } catch (err) {
    console.error("Razorpay Error:", err);
    return res.status(500).json({ status: false, message: err.message });
  }
};