const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quiz.controller");
const { authenticateUser } = require('../middlewares/auth.middleware');

//upload test paper
router.post('/create-quiz',authenticateUser, quizController.createQuiz);

//get all quiz question  by chapter
router.get('/:chapter_id',authenticateUser,quizController.getQuizByChapter)


//detele quiz
router.delete('/:chapter_id',authenticateUser,quizController.deleteQuizByChapterId)


module.exports=router;



