const TestPaper=require("../models/testPaper.model");
require("dotenv").config;


exports.uploadTestPaper=async(req,res)=>{
    try{
const{chapter_id,pdf_title}=req.body;
const file = req.file;
const pdf_url = `${file.filename}`;
if(!chapter_id||!pdf_title||!pdf_url){
    return res.status(400).json({status:false,message:"chapter_id,pdf_title and pdf_url is required."})
}
const isPdfExist=await TestPaper.isPdfExist({chapter_id,pdf_title});
if(isPdfExist){
    return res.status(400).json({status:false,message:"This pdf title is already exist for this chapter."})
}
const uploadTestPaper=await TestPaper.upload({chapter_id,pdf_title,pdf_url})
if(!uploadTestPaper){
    return res.status(400).json({status:false,message:"notes pdf not uploade."})
}
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