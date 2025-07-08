const db=require("../database/db");

class Feedback{
 static async addFeedback({full_name,feedback}){
    const [rows]=await db.query(`INSERT into tbl_feedbacks(full_name,feedback) values(?,?)`,[full_name,feedback]);
    return rows.insertId;
 }


static async getAllFeedback(){
    const [rows]=await db.query(`select * from tbl_feedbacks`);
    return rows;
}

}

module.exports = Feedback;