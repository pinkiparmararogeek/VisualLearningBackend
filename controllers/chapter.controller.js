const Chapter=require('../models/chapters.model');


exports.addChapterBySubject=async(req,res)=>{
    try{
const {chapter_name,subject_id_FK}=req.body;
if(!chapter_name||!subject_id_FK){
    return res.status(400).json({status:false,message:"chapter_name and subject_id_FK is required."})
}
const isChapterExist=await Chapter.chapterExist({chapter_name,subject_id_FK})
if(isChapterExist){
    return res.status(400).json({status:false,message:"This chapter is already exist for this subject."})
}
const addChapter=await Chapter.addChapter({chapter_name,subject_id_FK})
if(!addChapter){
    return res.status(400).json({status:false,message:"Chapter not added."})
}
return res.status(200).json({status:true,message:"Chapter added successfully.",data:addChapter})
    }catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}

exports.deleteChapter=async(req,res)=>{
    try{
const {chapter_id}=req.params;
const deleteChapter=await Chapter.deleteChapter(chapter_id)
if(!deleteChapter){
    return res.status(400).json({status:false,message:"There is no chapter for this id or chapter already deleted."})
}
return res.status(200).json({status:true,message:"Chapter deleted successfully."});
    }catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}