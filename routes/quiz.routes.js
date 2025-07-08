const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quiz.controller");
const { authenticateUser } = require('../middlewares/auth.middleware');

//upload test paper
router.post('/create-quiz',authenticateUser, quizController.createQuiz);


//get all question by quiz Id
router.get('/:chapter_id',authenticateUser,quizController.getQuizByChapterId)


//get quiz question by quiz id
router.get('/quiz-detail/:quiz_id',authenticateUser,quizController.getQuizQuestionByQuizId)


//update quiz
router.put('/:quiz_id',authenticateUser,quizController.editQuiz)

//delete quiz by quiz id
router.delete('/:quiz_id',authenticateUser,quizController.deleteQuizByQuizId);



module.exports=router;



