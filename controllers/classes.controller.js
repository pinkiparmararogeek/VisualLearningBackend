const Class=require('../models/classes.model');


exports.addClass=async(req,res)=>{
try{
const{category_id,class_name,class_icon}=req.body;

if(!category_id||!class_name||!class_icon){
    return res.status(400).json({status:false,message:"category_id,class_name,class_icon is required."})
}
const isClassExist=await  Class.findClass({category_id,class_name})

if(isClassExist){
    return res.status(400).json({status:false,message:"This class is already exist for this category."})
}
const addClass=await Class.addClass({category_id,class_name,class_icon})
if(!addClass){
    return res.status(400).json({status:false,message:"Class not added."})
}
return res.status(200).json({status:true,message:"Class added successfully.", class_id: addClass})

}
catch(err){
    return res.status(500).json({status:false,message:err.message})
}
}


exports.getClassesByCategory=async(req,res)=>{
    try{
        const{category_id}=req.params;
const classList=await  Class.getClassListByCategory(category_id)

if(!classList){
    return res.status(400).json({status:false,message:"There is no class awailable for this category"})
}
return res.status(200).json({status:true,message:"Class list found for This category",data:classList})
    }
    catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}

exports.deleteClass=async(req,res)=>{
    try{
const {class_id}=req.params;
const deleteClass=await Class.deleteClass(class_id)

if(!deleteClass){
    return res.status(400).json({status:false,message:"There is no class available for this id or class is already deleted"});
}
return res.status(200).json({status:true,message:"Class is deleted."})
    }
    catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}


exports.getSubjectsAndChaptersByClass = async (req, res) => {
  const { class_name } = req.params;
  try {
    const getClassDetails=await Class.classDetails(class_name)
    if(!getClassDetails){
      return res.status(400).json({status:false,mssage:"Class detail not found."})
    }
    return res.status(200).json({status:true,message:"Class detail found successfully.",data:getClassDetails})
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};