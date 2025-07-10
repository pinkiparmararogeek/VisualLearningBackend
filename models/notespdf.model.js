const db=require('../database/db');

class Notes{
    static async upload({chapter_id,pdf_title,pdf_url,is_paid,is_notify}){
        const [insert]=await db.query(`insert into tbl_chapter_notes (chapter_id_FK	,pdf_title,	pdf_url,is_paid,is_notify) values(?,?,?,?,?)`,[chapter_id,pdf_title,pdf_url,is_paid,is_notify]);
        return insert.insertId;
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
static async getNotesPdfById(notes_id){
   const [rows]=await db.query(`SELECT * from  tbl_chapter_notes where note_id_PK=?`,[notes_id]);
  return rows[0];
}
static async duplicatePdfTitele({notes_id,pdf_title,chapter_id}){
  const [rows]=await db.query(`Select * from tbl_chapter_notes where chapter_id_FK=? AND pdf_title=? AND note_id_PK!=?`,[chapter_id,pdf_title,notes_id]);
  return rows[0];
}
static async updateNotesPdf({notes_id,chapter_id_FK,pdf_title,pdf_url,is_paid}){
  const [rows]=await db.query(`UPDATE tbl_chapter_notes SET chapter_id_FK = ?, pdf_title = ?,pdf_url = ?,is_paid=? WHERE note_id_PK  = ?`,[chapter_id_FK,pdf_title,pdf_url,is_paid,notes_id]);
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
static async adNotifictionInDb({ title,description,uploadNotes }) {
  const [rows] = await db.query(
    `INSERT INTO tbl_notifications (	title,description,content_id,content_type) VALUES (?, ?, ?, ?)`,
    [title,description,uploadNotes,2] 
  );
  return rows.insertId > 0;
}
}


module.exports=Notes;