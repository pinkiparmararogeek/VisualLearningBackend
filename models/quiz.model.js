const db=require("../database/db")


class Quiz{

static async createQuiz({ chapter_id,
        question_text,
        option_1,
        option_2,
        option_3,
        option_4,
        correct_option}){
 const [rows]=await db.query(`INSERT INTO tbl_chapter_quizzes 
        (chapter_id_FK, question_text, option_1, option_2, option_3, option_4, correct_option)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [chapter_id, question_text, option_1, option_2, option_3, option_4, correct_option]
 );
 return rows.insertId;
}


static async getQuiz(chapter_id){
    const [rows]=await db.query(`select * from tbl_chapter_quizzes where  chapter_id_FK=?`,[chapter_id]);
    return rows;
}


static async deleteQuiz(chapter_id){
    const[rows]=await db.query("delete from tbl_chapter_quizzes where  chapter_id_FK=?",[chapter_id]);
    return rows.affectedRows>0;
}
}
module.exports=Quiz;