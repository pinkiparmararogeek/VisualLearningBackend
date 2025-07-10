const db=require('../database/db')


class TestPaper{



static async isPdfExist({chapter_id,pdf_title}){
    const [rows]=await db.query('SELECT * from tbl_chapter_testpapers where chapter_id_FK=? AND pdf_title=?',[chapter_id,pdf_title]);
    return rows[0];
}

    static async upload({chapter_id,pdf_title,pdf_url,is_paid,is_notify}){
        const [insert]=await db.query(`insert into tbl_chapter_testpapers (chapter_id_FK,pdf_title,	pdf_url,is_paid,is_notify) values(?,?,?,?,?)`,[chapter_id,pdf_title,pdf_url,is_paid,is_notify]);
        return insert.insertId
    }


static async getTestPaper(chapter_id){
    const [rows]=await db.query('select * from  tbl_chapter_testpapers where chapter_id_FK=?',[chapter_id]);
    return rows;
}

static async deleteTestPaper(testPaper_id){
    const [rows]=await db.query('DELETE from tbl_chapter_testpapers where testpaper_id_PK=?',[testPaper_id]);
    return rows.affectedRows>0
}


static async getTestPaperPdfById(testPaper_id){
   const [rows]=await db.query(`SELECT * from  tbl_chapter_testpapers where testpaper_id_PK =?`,[testPaper_id]);
  return rows[0];
}



static async duplicateTestPaperPdfTitele({testPaper_id,pdf_title,chapter_id}){
  const [rows]=await db.query(`Select * from tbl_chapter_testpapers where chapter_id_FK=? AND pdf_title=? AND testpaper_id_PK !=?`,[chapter_id,pdf_title,testPaper_id]);
  return rows[0];
}

static async updateTestPaperPdf({testPaper_id,chapter_id_FK,pdf_title,pdf_url,is_paid}){
  const [rows]=await db.query(`UPDATE tbl_chapter_testpapers SET chapter_id_FK = ?, pdf_title = ?,pdf_url = ?,is_paid=? WHERE testpaper_id_PK= ?`,[chapter_id_FK,pdf_title,pdf_url,is_paid,testPaper_id]);
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



static async adNotifictionInDb({ title,description,uploadTestPaper }) {
  const [rows] = await db.query(
    `INSERT INTO tbl_notifications (title,description,content_id,content_type) VALUES (?, ?, ?, ?)`,
    [title,description,uploadTestPaper,3] 
  );
  return rows.insertId > 0;
}


}

module.exports=TestPaper;