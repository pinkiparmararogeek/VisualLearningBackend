const TestPaper=require("../models/testPaper.model");
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

exports.uploadTestPaper=async(req,res)=>{
    try{
const{chapter_id,pdf_title,is_paid,topic }=req.body;
const file = req.file;
const pdf_url = `${file.filename}`;
if(!chapter_id||!pdf_title||!pdf_url){
    return res.status(400).json({status:false,message:"chapter_id,pdf_title and pdf_url is required."})
}
const isPdfExist=await TestPaper.isPdfExist({chapter_id,pdf_title});
if(isPdfExist){
    return res.status(400).json({status:false,message:"This pdf title is already exist for this chapter."})
}
const uploadTestPaper=await TestPaper.upload({chapter_id,pdf_title,pdf_url,is_paid})
if(!uploadTestPaper){
    return res.status(400).json({status:false,message:"notes pdf not uploade."})
}
//firebase notification start
const getChapter=await TestPaper.getChapterById(chapter_id);
if(!getChapter){
    return res.status(400).json({status:false,message:"Chapter not found for this chapter_id."})
}
const chapterName=getChapter.chapter_name;
console.log("chapterName>>>",chapterName)
const subjectId=getChapter.subject_id_FK;


const getSubject=await TestPaper.getSubjectById(subjectId);
if(!getSubject){
    return res.status(400).json({status:false,message:"Subject not found for this subject id."})
}
const subjectName=getSubject.subject_name;
console.log("subjectName>>>",subjectName)
const classId=getSubject.class_id_FK;
const getClass=await TestPaper.getClassById(classId);

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

const addNotificationInDb=await TestPaper.adNotifictionInDb({className,subjectName,chapterName,pdf_title});

if(!addNotificationInDb){
    return res.status(400).json({status:false,message:"Notification detail not saved in database."})
}
//firebase notification ends



return res.status(200).json({status:true,message:"Test Paper pdf uploaded successfully.",data:uploadTestPaper})
    }
    catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}




exports.getPaperPdfListByChapter=async(req,res)=>{

    try{
const{chapter_id}=req.params;
const getPaperPdf=await TestPaper.getTestPaper(chapter_id)
if(!getPaperPdf){
    return res.status(400).json({status:false,message:"There is no test paper pdf uploaded for this chapter."})
}


 const baseUrl = `${process.env.BASE_URL}/uploads/notes/`;
    const updatedList = getPaperPdf.map(testPaper => ({
      ...testPaper,
      pdf_url: baseUrl + testPaper.pdf_url
    }));
return res.status(200).json({status:true,message:"Test Paer pdf found successfully.",data:updatedList})
    }
    catch(err){
        return res.status(500).json({status:true,message:err.message})
    }
}




exports.deleteTestPaperPdf=async(req,res)=>{
try{
const{testPaper_id}=req.params;
const deleteTestPaper=await TestPaper.deleteTestPaper(testPaper_id);
if(!deleteTestPaper){
    return res.status(400).json({status:false,message:"There is no test paper pdf found for this testPaper_id or this pdf is already deleted."})
}
return res.status(200).json({status:true,message:"Test Paper deleted successfully."})
    }
    catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}



exports.editTestPaper=async(req,res)=>{
    try{
        const{testPaper_id}=req.params;
        const{pdf_title,is_paid,chapter_id}=req.body;

const file = req.file;

const existingTestPaper=await TestPaper.getTestPaperPdfById(testPaper_id);
const pdf_url = file ? file.filename : existingTestPaper.pdf_url;

if(!existingTestPaper){
    return res.status(400).json({status:false,message:"Notes pdf not found."})
}
const duplicatePdfTitele=await TestPaper.duplicateTestPaperPdfTitele({testPaper_id,pdf_title,chapter_id});
if(duplicatePdfTitele){
    return res.status(400).json({status:false,message:"This test paper pdf title is already exist for this chapter."})
}
const updateTestPaper=await TestPaper.updateTestPaperPdf({
    testPaper_id,
    chapter_id_FK:existingTestPaper.chapter_id_FK,
    pdf_title:pdf_title||existingTestPaper.pdf_title,
    pdf_url:pdf_url||existingTestPaper.pdf_url,
    is_paid:is_paid||existingTestPaper.is_paid})


if(!updateTestPaper){
  return res.status(400).json({status:false,message:"Test paper pdf is not updated."})
}
return res.status(200).json({status:true,message:"Test paper pdf is updated successfully."})

    }catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}