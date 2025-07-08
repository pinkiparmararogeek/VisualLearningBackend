const Class=require('../models/classes.model');
require('dotenv').config();
require('dotenv').config();
exports.addClass = async (req, res) => {
  try {
    const { class_name,sort_order } = req.body;
    const icon = req.file?.filename;

    if (!class_name || !icon||!sort_order) {
      return res.status(400).json({
        status: false,
        message: "class_name and icon,sort_order are required."
      });
    }

   const isClassExist=await  Class.findClass({class_name})

if(isClassExist){
    return res.status(400).json({status:false,message:"This class is already exist.className must be unique."})
}
const isShortOrderExist=await Class.findSortOrder(sort_order)

if(isShortOrderExist){
  return res.status(400).json({status:false,message:"This sort order is already exist"})
}
const addClass=await Class.addClass({sort_order,class_name,icon})
if(!addClass){
    return res.status(400).json({status:false,message:"Class not added."})
}
return res.status(200).json({status:true,message:"Class added successfully.", class_id: addClass})

  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message
    });
  }
};




// exports.getClassesByCategory=async(req,res)=>{
//     try{
//         const{category_id}=req.params;
// const classList=await  Class.getClassListByCategory(category_id)

// if(!classList){
//     return res.status(400).json({status:false,message:"There is no class awailable for this category"})
// }



//  const baseUrl = `${process.env.BASE_URL}/uploads/icons/`;
//     const updatedList = classList.map(category => ({
//       ...category,
//       class_icon: baseUrl + category.class_icon
//     }));

// return res.status(200).json({status:true,message:"Class list found for This category",data:updatedList})
//     }
//     catch(err){
//         return res.status(500).json({status:false,message:err.message})
//     }
// }

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
  const { class_id } = req.params;
  try {
    const getClassDetails=await Class.classDetails(class_id)
    if(!getClassDetails){
      return res.status(400).json({status:false,mssage:"Class detail not found."})
    }
    return res.status(200).json({status:true,message:"Class detail found successfully.",data:getClassDetails})
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};


exports.getClassList=async(req,res)=>{
  try{
const getClassList=await Class.classList();
if(!getClassList){
  return res.status(400).json({status:false,message:"Class list not found"})
}
const baseUrl = `${process.env.BASE_URL}/uploads/icons/`;
    const updatedList = getClassList.map(category => ({
      ...category,
      class_icon: baseUrl + category.class_icon
    }));
return res.status(200).json({status:true,message:"Class list found successfully",data:updatedList})
  }catch(err){
    return res.status(500).json({status:false,message:err.message})
  }
}

exports.editClass=async(req,res)=>{
  try{
    const{class_id}=req.params;
    const{class_name, sort_order }=req.body;
 const icon = req.file?.filename;

    // Get existing data
    const existingClass = await Class.getClassById(class_id);

    if (!existingClass) {
      return res.status(404).json({ status: false, message: "Class not found" });
    }

    const duplicateClassName=await Class.duplicateClassName(class_id,class_name);

    if(duplicateClassName){
      return res.status(400).json({status:false,message:"This class Name is already exist."})
    }

const duplicateSortOrder=await Class.duplicateSortOrder(class_id,sort_order);
if(duplicateSortOrder){
  return res.status(400).json({status:false,message:"This sort order is alredy exits."})
}
const updateClassInfo=await Class.updateClassInfo( {
  class_id,
  class_name: class_name || existingClass.class_name,
      sort_order: sort_order !== undefined ? sort_order : existingClass.sort_order,
      class_icon: icon || existingClass.class_icon
    })
if(!updateClassInfo){
  return res.status(400).json({status:false,message:"Class infomation is not updated."})
}
return res.status(200).json({status:true,message:"Class infomation is updated successfully."})

  }catch(err){
    return res.status(500).json({status:false,message:err.message})
  }
}

exports.activeInactiveClass=async(req,res)=>{
  try{
const {class_id,status}=req.body;
 if (![1, 2].includes(Number(status))) {
    return res.status(400).json({ message: "Invalid status. Use 1 for active, 2 for inactive." });
  }
  const statusUpdateClass=await Class.statusUpdateClass(class_id,status);
  if(!statusUpdateClass){
    return res.status(400).json({status:false,message:"Class status is not updated."});
  }
    return res.status(200).json({status:true,
      message: `Class has been ${status == 1 ? "Activated" : "In-activated"}.`
    });
  }
  catch(err){
    return res.status(500).json({status:false,message:err.message})
  }
}