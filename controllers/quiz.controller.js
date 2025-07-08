const Quiz = require("../models/quiz.model");
const XLSX = require('xlsx');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

const admin=require('../database/firebase')



const sendNotification = async (topic,className,subjectName,chapterName, quizTitle, body,title,data) => {
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
        titlt:quizTitle
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




exports.createQuiz = [
  upload.single("quiz_excelsheet"),
  async (req, res) => {
    const quizTitle = req.body.quizTitle;
    const chapterId=req.body.chapterId;
    const fileBuffer = req.file?.buffer;
const is_paid=req.body.is_paid;
const topic=req.body.topic;
    console.log("quizTitle",quizTitle)
    console.log("fileBuffer",fileBuffer)
    if (!quizTitle || !fileBuffer||!chapterId) {
      return res.status(400).json({ status: false, message: "quizTitle,chapterId and quiz excelsheet  is required." });
    }

    try {
      const isQuizExist = await Quiz.isQuizExist(quizTitle);
      if (isQuizExist) {
        return res.status(400).json({
          status: false,
          message: "This Quiz title already exists. Quiz title must be unique.",
        });
      }
      const quizId = await Quiz.insertQuiz({quizTitle,chapterId,is_paid});
      if (!quizId) {
        return res.status(400).json({ status: false, message: "Quiz not added." });
      }
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);
     const addQuizQuestions= await Quiz.insertQuizQuestions(quizId, rows,chapterId);
if(!addQuizQuestions){
  return res.status(400).json({status:false,message:"Quiz question not added."})
}

//firebase notification start
const getChapter=await Quiz.getChapterById(chapterId);
if(!getChapter){
    return res.status(400).json({status:false,message:"Chapter not found for this chapter_id."})
}
const chapterName=getChapter.chapter_name;
console.log("chapterName>>>",chapterName)
const subjectId=getChapter.subject_id_FK;


const getSubject=await Quiz.getSubjectById(subjectId);
if(!getSubject){
    return res.status(400).json({status:false,message:"Subject not found for this subject id."})
}
const subjectName=getSubject.subject_name;
console.log("subjectName>>>",subjectName)
const classId=getSubject.class_id_FK;
const getClass=await Quiz.getClassById(classId);

if(!getClass){
    return res.status(400).json({status:false,message:"Class not found for this class_id."})
}

const className=getClass.class_name;
console.log("className>>>",className)
const title = `New Notes Added: ${quizTitle}`;
const body = `${className} > ${subjectName} > ${chapterName} - A new PDF titled "${quizTitle}" has been uploaded.`;

const notification = await sendNotification(
  topic,
  className,
  subjectName,
  chapterName,
  quizTitle,
  title,
  body
);

if(!notification){
    return res.status(400).json({status:false,message:"Notification not send to users."})
}

const addNotificationInDb=await Quiz.adNotifictionInDb({className,subjectName,chapterName,quizTitle});

if(!addNotificationInDb){
    return res.status(400).json({status:false,message:"Notification detail not saved in database."})
}



      return res.json({
        status: true,
        message: "Quiz uploaded and saved successfully",
        quiz_id: quizId,
      });
    } catch (error) {
      console.error("Error in createQuiz:", error);
      return res.status(500).json({ status: false, message: "Server error" });
    }
  },
];




exports.getQuizByChapterId=async(req,res)=>{
  try{
    const {chapter_id}=req.params;
    const getQuiz=await Quiz.getQuiz(chapter_id);
    if(!getQuiz){
      return res.status(400).json({status:false,message:"No quize avaibalbe for this quiz_id."})
    }
    return res.status(200).json({status:true,message:"Quiz find successfully.",data:getQuiz})
  }catch(err){
    return res.status(500).json({status:false,message:err.message})
  }
}

exports.deleteQuizByQuizId=async(req,res)=>{
try{
  const{quiz_id}=req.params;
  const deteleQuiz=await Quiz.deleteQuiz(quiz_id);
  if(!deteleQuiz){
    return res.status(400).json({status:400,message:"This quiz is already deleted."})
  }
  const deleteQuestions=await Quiz.deleteQuestion(quiz_id)
  if(!deleteQuestions){
     return res.status(400).json({status:400,message:"This quiz is already deleted."})
  }
  return res.status(200).json({status:true,messsage:"Quiz deleted successfully."})
}catch(err){
  return res.status(500).json({status:true,message:err.message})
}
}

exports.getQuizQuestionByQuizId=async(req,res)=>{
  try{
    const{quiz_id}=req.params;
    const getQuizDetail=await Quiz.quizDetail(quiz_id);
    if(!getQuizDetail){
      return res.status(400).json({status:false,message:"Quiz question not found for this quiz id."})
    }
    return res.status(200).json({status:true,message:"Quiz question found successfull.",data:getQuizDetail});
  }catch(err){
    return res.status(500).json({status:false,message:err.message})
  }
}


exports.editQuiz=async(req,res)=>{
  try{
const{quiz_id}=req.params;
const{quizTitle,is_paid}=req.body;
const getQuizById=await Quiz.getQuizByquizId(quiz_id);

if(!getQuizById){
  return res.status(400).json({status:false,message:"Quiz not found."})
}
const chapter_id_FK=getQuizById.chapter_id_FK;
const duplicateQuizTitle=await Quiz.duplicateQuizTitle({quiz_id,chapter_id_FK,quizTitle})

if(duplicateQuizTitle){
  return res.status(400).json({status:false,message:"This quiz title is already exist for this chapter."})
}
if(duplicateQuizTitle){
  return res.status(400).json({status:false,message:"This quiz title is already exist for this chapter."})
}
const updateQuiz=await Quiz.updateQuiz({
  quiz_id,
  chapter_id_FK:chapter_id_FK,
  	title:quizTitle||getQuizById.title,
    is_paid:is_paid||getQuizById.is_paid
})
if(!updateQuiz){
  return res.status(400).json({status:false,message:"Quiz title not updated."})
}
return res.status(200).json({status:true,message:"QUiz updated successfully."})
  }catch(err){
    return res.status(500).json({status:false,message:err.message})
  }
}