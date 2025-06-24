const Notes=require("../models/notespdf.model");
require("dotenv").config;
exports.uploadNotesPdf=async(req,res)=>{
    try{
const{chapter_id,pdf_title}=req.body;

const file = req.file;
const pdf_url = `${file.filename}`;
if(!chapter_id||!pdf_title||!pdf_url){
    return res.status(400).json({status:false,message:"chapter_id,pdf_title and pdf_url is required."})
}
const isPdfExist=await Notes.isPdfExist({chapter_id,pdf_title});

if(isPdfExist){
    return res.status(400).json({status:false,message:"This pdf title is already exist for this chapter."})
}
const uploadNotes=await Notes.upload({chapter_id,pdf_title,pdf_url})

if(!uploadNotes){
    return res.status(400).json({status:false,message:"notes pdf not uploade."})
}
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