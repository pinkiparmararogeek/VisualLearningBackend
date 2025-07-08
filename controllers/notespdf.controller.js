const Notes=require("../models/notespdf.model");
require("dotenv").config;
const admin=require('../database/firebase')



const sendNotification = async (topic,className,subjectName,chapterName, pdf_title, body,title,data) => {
  if (!topic) {
    console.error("FCM topic is missing");
    return false;
  }

  const message = {
    topic: topic,
    notification: {
      title,
      body,
    },
    data: {
        class:className,
        subjectname:subjectName,
        chaptername:chapterName,
        titlt:pdf_title
    }
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent:", response);
    return true;
  } catch (error) {
    console.error("Error sending notification:", error.message || error);
    return false;
  }
};


exports.uploadNotesPdf=async(req,res)=>{
    try{
const{chapter_id,pdf_title,is_paid,topic}=req.body;
console.log('topic>>>>',topic)
const file = req.file;
const pdf_url = `${file.filename}`;
if(!chapter_id||!pdf_title||!pdf_url){
    return res.status(400).json({status:false,message:"chapter_id,pdf_title and pdf_url is required."})
}
const isPdfExist=await Notes.isPdfExist({chapter_id,pdf_title});

if(isPdfExist){
    return res.status(400).json({status:false,message:"This pdf title is already exist for this chapter."})
}
const uploadNotes=await Notes.upload({chapter_id,pdf_title,pdf_url,is_paid})

if(!uploadNotes){
    return res.status(400).json({status:false,message:"notes pdf not uploade."})
}
//firebase notification start
const getChapter=await Notes.getChapterById(chapter_id);
if(!getChapter){
    return res.status(400).json({status:false,message:"Chapter not found for this chapter_id."})
}
const chapterName=getChapter.chapter_name;
console.log("chapterName>>>",chapterName)
const subjectId=getChapter.subject_id_FK;


const getSubject=await Notes.getSubjectById(subjectId);
if(!getSubject){
    return res.status(400).json({status:false,message:"Subject not found for this subject id."})
}
const subjectName=getSubject.subject_name;
console.log("subjectName>>>",subjectName)
const classId=getSubject.class_id_FK;
const getClass=await Notes.getClassById(classId);

if(!getClass){
    return res.status(400).json({status:false,message:"Class not found for this class_id."})
}

const className=getClass.class_name;
console.log("className>>>",className)
const title = `New Notes Added: ${pdf_title}`;
const body = `${className} > ${subjectName} > ${chapterName} - A new PDF titled "${pdf_title}" has been uploaded.`;

const notification = await sendNotification(
  topic,
  className,
  subjectName,
  chapterName,
  pdf_title,
  title,
  body
);

if(!notification){
    return res.status(400).json({status:false,message:"Notification not send to users."})
}

const addNotificationInDb=await Notes.adNotifictionInDb({className,subjectName,chapterName,pdf_title});

if(!addNotificationInDb){
    return res.status(400).json({status:false,message:"Notification detail not saved in database."})
}
//firebase notification ends
return res.status(200).json({status:true,message:"Notes pdf uploaded successfully.",data:uploadNotes})
    }
    catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}


exports.getNotesPdfListByChapter=async(req,res)=>{

    try{
const{chapter_id}=req.params;
const getNotesList=await Notes.getNotesList(chapter_id)
if(!getNotesList){
    return res.status(400).json({status:false,message:"There is no notes pdf uploaded for this chapter."})
}


 const baseUrl = `${process.env.BASE_URL}/uploads/notes/`;
    const updatedList = getNotesList.map(notes => ({
      ...notes,
      pdf_url: baseUrl + notes.pdf_url
    }));
return res.status(200).json({status:true,message:"Notes pdf list found successfully.",data:updatedList})
    }
    catch(err){
        return res.status(500).json({status:true,message:err.message})
    }
}

exports.deleteNotesPdf=async(req,res)=>{
try{
const{notes_id}=req.params;
const deleteNotes=await Notes.deleteNotes(notes_id);
if(!deleteNotes){
    return res.status(400).json({status:false,message:"There is no notes pdf found for this notes_id or this pdf is already deleted."})
}
return res.status(200).json({status:true,message:"Notes pdf deleted successfully."})
    }
    catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}


exports.editNotes=async(req,res)=>{
    try{
        const{notes_id}=req.params;
        const{pdf_title,is_paid,chapter_id}=req.body;

const file = req.file;

const existingNotes=await Notes.getNotesPdfById(notes_id);
const pdf_url = file ? file.filename : existingNotes.pdf_url;

if(!existingNotes){
    return res.status(400).json({status:false,message:"Notes pdf not found."})
}
const duplicatePdfTitele=await Notes.duplicatePdfTitele({notes_id,pdf_title,chapter_id});
if(duplicatePdfTitele){
    return res.status(400).json({status:false,message:"This pdf title is already exist for this chapter."})
}
const updateNotes=await Notes.updateNotesPdf({
    notes_id,
    chapter_id_FK:existingNotes.chapter_id_FK,
    pdf_title:pdf_title||existingNotes.pdf_title,
    pdf_url:pdf_url||existingNotes.pdf_url,
    is_paid:is_paid||existingNotes.is_paid})


if(!updateNotes){
  return res.status(400).json({status:false,message:"Notes pdf is not updated."})
}
return res.status(200).json({status:true,message:"Notes pdf is updated successfully."})

    }catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}