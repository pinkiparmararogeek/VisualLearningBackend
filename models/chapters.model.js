const db=require("../database/db")

class Chapter{

static async chapterExist({chapter_name,subject_id_FK}){
const [rows]=await db.query("SELECT * from tbl_chapter where chapter_name =? AND 	subject_id_FK=?",[chapter_name,subject_id_FK]);
return rows[0]
}


static async addChapter({chapter_name,subject_id_FK}){
    const [insert]=await db.query("insert into tbl_chapter (chapter_name,subject_id_FK) values(?,?)",[chapter_name,subject_id_FK]);
    return insert.insertId;
}

static async deleteChapter(chapter_id){
    const[rows]=await db.query("DELETE from tbl_chapter where chapter_id_PK=?",[chapter_id]);
    return rows.affectedRows>0
}
}

module.exports=Chapter;