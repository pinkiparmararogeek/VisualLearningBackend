const Subject=require('../models/subjects.model');

exports.addSubject=async(req,res)=>{
    try{
        const{subject_name,class_id}=req.body;
        if(!subject_name||!class_id){
            return res.status(400).json({status:false,message:"subject_name,class_id"})            
        }
        //chech is this subject already exit for this class 
        const isSubjectExist=await Subject.isSubjectExist({subject_name,class_id})
        if(isSubjectExist){
            return res.status(400).json({status:false,message:"This subject is already exist for this class."})
        }
        const addSubject=await Subject.addSubject({subject_name,class_id})
        if(!addSubject){
            return res.status(400).json({status:false,message:"Subject not added."})
        }
        return res.status(200).json({status:true,message:"Subject added successfully"});
    }catch(err){
    return res.status(500).json({status:false,message:err.message})
    }
}

exports.getSubjectsByClassName = async (req, res) => {
  try {
    const { class_name } = req.params;

    if (!class_name) {
      return res.status(400).json({ status: false, message: "class_name is required." });
    }

    const subjects = await Subject.getSubjectsByClassName(class_name);

    if (!subjects || subjects.length === 0) {
      return res.status(404).json({ status: false, message: "No subjects found for this class name." });
    }

    return res.status(200).json({
      status: true,
      message: "Subjects retrieved successfully.",
      data: subjects,
    });

  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};


exports.deleteSubject=async(req,res)=>{
    try{
        const{subject_id}=req.params;
        const deleteSubject=await Subject.deleteSubject(subject_id)
        if(!deleteSubject){
            return res.status(400).json({status:false,message:"There is no subject for this id or this subject is alredy deleted."})
        }
        return res.status(200).json({status:true,message:"Subject deleted successfully."})
    }
    catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}

exports.editSubject=async(req,res)=>{
  try{
const{subject_id,subject_name}=req.body;
const isSubjectExist=await Subject.getSubjectById(subject_id)


if(!isSubjectExist){
  return res.status(400).json({status:false,message:"Subject not found for this subject_id."})
}
const duplicateName=await Subject.duplicateSubject(subject_id,subject_name)
if(duplicateName)
{
return res.status(400).json({status:false,message:"This subject name is alredy exists."})
}

const updateSubject=await Subject.updateSubject({
  subject_id,
  subject_name:subject_name||isSubjectExist.subject_name
})
if(!updateSubject){
  return res.status(400).json({status:false,message:"Subject not updated."})
}
return res.status(200).json({status:true,message:"Subject updated successfully."})

  }catch(err){
    return res.status(500).json({status:false,message:err.message})
  }
}


exports.activeInActiveSubject=async(req,res)=>{
  try{
const{subject_id,status}=req.body;
 if (![1, 2].includes(Number(status))) {
    return res.status(400).json({ message: "Invalid status. Use 1 for active, 2 for inactive." });
  }


  const updateSubjectStatus=await Subject.UpdateSubjectStatus({subject_id,status});
  if(!updateSubjectStatus){
    return res.status(400).json({status:false,message:"Subject status is not updated."})
  }
  return res.status(200).json({status:true,message:`Subject hase been ${status==1?"Activated":"In-activated"} successfully.`});


  }catch(err){
    return res.status(500).json({status:false,message:err.message})
  }
}

