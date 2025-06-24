const db=require('../database/db');

class Notes{
    static async upload({chapter_id,pdf_title,pdf_url}){
        const [insert]=await db.query(`insert into tbl_chapter_notes (chapter_id_FK	,pdf_title,	pdf_url) values(?,?,?)`,[chapter_id,pdf_title,pdf_url]);
        return insert.insertId
    }

static async isPdfExist({chapter_id,pdf_title}){
    const [rows]=await db.query('SELECT * from tbl_chapter_notes where chapter_id_FK=? AND pdf_title=?',[chapter_id,pdf_title]);
    return rows[0];
}

static async getNotesList(chapter_id){
    const [rows]=await db.query('select * from  tbl_chapter_notes where chapter_id_FK=?',[chapter_id]);
    return rows;
}

static async deleteNotes(notes_id){
    const [rows]=await db.query('DELETE from tbl_chapter_notes where note_id_PK=?',[notes_id]);
    return rows.affectedRows>0
}


}


module.exports=Notes;