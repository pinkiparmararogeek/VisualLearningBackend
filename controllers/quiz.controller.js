const Quiz=require("../models/quiz.model");



exports.createQuiz = async (req, res) => {
  const { chapter_id, questions } = req.body;

  if (!chapter_id || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({
      message: 'chapter_id and an array of questions are required'
    });
  }

  try {
    for (const q of questions) {
      const {
        question_text,
        option_1,
        option_2,
        option_3,
        option_4,
        correct_option
      } = q;

      // Validate each question
      if (
        !question_text || !option_1 || !option_2 || !option_3 || !option_4 ||
        !['1', '2', '3', '4'].includes(correct_option)
      ) {
        return res.status(400).json({
          message: 'Each question must have 4 options and a correct_option (1–4)'
        });
      }

      const insertedId = await Quiz.createQuiz({
        chapter_id,
        question_text,
        option_1,
        option_2,
        option_3,
        option_4,
        correct_option
      });

      if (!insertedId) {
        return res.status(400).json({
          status: false,
          message: 'One of the quiz questions failed to insert'
        });
      }
    }

    return res.status(200).json({
      status: true,
      message: 'Quiz questions added successfully'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error creating quiz' });
  }
};

exports.getQuizByChapter=async(req,res)=>{
    try{
const{chapter_id}=req.params;
const getQuiz=await Quiz.getQuiz(chapter_id)

if(!getQuiz){
    return res.status(400).json({status:false,message:"There are no quiz available for this chapter."})
}
return res.status(200).json({status:true,message:"Quiz found successfully for this chapter",data:getQuiz})
    }
    catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}


exports.deleteQuizByChapterId=async(req,res)=>{
    try{
        const {chapter_id}=req.params;
        const deleteQuiz=await Quiz.deleteQuiz(chapter_id)

        if(!deleteQuiz){
            return res.status(400).json({status:false,message:"No quiz available for this chapter_id or quiz already deleted."})
        }
        return res.status(200).json({status:true,message:"Quiz deleted successfully."})
    }catch(err){
        return res.status(500).json({status:false,message:err.message})
    }
}