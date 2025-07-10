const db=require("../database/db")


class Quiz{

static async isQuizExist(quizTitle){
    const [rows]=await db.query(`Select * from tbl_quizzes where title=?`,[quizTitle]);
    return rows[0];
}


static async insertQuiz({quizTitle,chapterId,is_paid,is_notify}){
    const [result] = await db.query(`INSERT INTO tbl_quizzes (title,chapter_id_FK,is_paid,is_notify) VALUES (?,?,?,?)`, [quizTitle,chapterId,is_paid,is_notify]);
    return result.insertId;
}

static async insertQuizQuestions(quizId, rows,chapterId){
   for (const row of rows) {
      await db.query(
        `INSERT INTO tbl_quiz_questions (
          quiz_id_FK,chapter_id_FK, question_no, question, option_a, option_b, option_c, option_d, right_answer, explanation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
        [
          quizId,
          chapterId,
          row['QuestionNo'],
          row['Question'],
          row['OptionA'],
          row['OptionB'],
          row['OptionC'],
          row['OptionD'],
          row['RightAnswer'],
          row['Explanation'] || "",
        ]
      );
    }
    return true;
}

static async getQuiz(chapter_id){
    const [rows]=await db.query(`SELECT * from tbl_quizzes where chapter_id_FK=?`,[chapter_id]);
    return rows;
}

static async deleteQuiz(quiz_id){
    const[deleteRows]=await db.query(`DELETE from tbl_quizzes where quiz_id_PK=?`,[quiz_id]);
    return deleteRows.affectedRows>0;
}

static async deleteQuestion(quiz_id){
    const[deleteRows]=await db.query(`DELETE from tbl_quiz_questions where quiz_id_FK=?`,[quiz_id]);
    return deleteRows.affectedRows>0;
}

static async quizDetail(quiz_id){
  const [rows]=await db.query(`SELECT * from tbl_quiz_questions where quiz_id_FK=?`,[quiz_id]);
  return rows;
}


static async getQuizByquizId(quiz_id){
  const[rows]=await db.query('SELECT * from tbl_quizzes where quiz_id_PK=?',[quiz_id]);
  return rows[0];
}


static async duplicateQuizTitle({quiz_id,chapter_id_FK,quizTitle}){
  const [rows]=await db.query('SELECT * from tbl_quizzes where chapter_id_FK=? AND title=? AND quiz_id_PK!=?',[chapter_id_FK,quizTitle,quiz_id]);
  return rows[0];
}


static async updateQuiz({quiz_id,chapter_id_FK,title,is_paid}){
const [rows]=await db.query('UPDATE tbl_quizzes set chapter_id_FK=? ,title=?,is_paid=? where quiz_id_PK=?',[chapter_id_FK,title,is_paid,quiz_id]);
return rows.affectedRows>0;
}

//firebase ntification
static async getChapterById(chapter_id){
  const [rows]=await db.query(`Select * from tbl_chapter where chapter_id_PK=?`,[chapter_id]);
  return rows[0];
}

static async getSubjectById(subjectId){
  const [rows]=await db.query(`Select * from tbl_subjects where subject_id_PK =?`,[subjectId]);
  return rows[0];
}

static async getClassById(classId){
  const[rows]=await db.query(`Select * from tbl_classes where class_id_PK=?`,[classId]);
  return rows[0];
}



static async adNotifictionInDb({title,description,quizId}) {
  const [rows] = await db.query(
    `INSERT INTO tbl_notifications (title,description,content_id,content_type) VALUES (?, ?, ?, ?)`,
    [title,description,quizId,4] 
  );
  return rows.insertId > 0;
}
}
module.exports=Quiz;