const db=require("../database/db")

class Video{

static async uploadVideo({chapter_id, video_title,video_hindi, video_english, description, thumbnail_url, duration,video_type,is_paid}){
    const [rows]=await db.query(`
      INSERT INTO tbl_chapter_videos 
        (chapter_id_FK, video_title, video_url_hindi,video_url_english, description, thumbnail_url, duration,video_type,is_paid)
      VALUES (?, ?, ?, ?, ?, ?,?,?,?)`,
      [chapter_id, video_title, video_hindi,video_english, description, thumbnail_url, duration,video_type,is_paid]
    );
return rows.insertId;
}

static async isVideoxist({chapter_id,video_title}){
  const [rows]=await db.query(`SELECT * from tbl_chapter_videos where chapter_id_FK=? AND video_title=?`,[chapter_id,video_title]);
  return rows[0];
}


static async getVideoList(chapter_id){
  const[rows]=await db.query(`SELECT * from tbl_chapter_videos where chapter_id_FK=?`,[chapter_id]);
  return rows;
}



static async deleteVideo(video_id){
  const [rows]=await db.query(`DELETE from  tbl_chapter_videos where  video_id_PK  =?`,[video_id]);

  return rows.affectedRows>0;
}


static async getVideoById(video_id){
  const [rows]=await db.query('SELECT * from tbl_chapter_videos where  video_id_PK=?',[video_id]);
  return rows[0];
}
static async duplicateVideoTitele({video_id,video_title,chapter_id}){
  const [rows]=await db.query('SELECT * from tbl_chapter_videos where video_title=? AND chapter_id_FK=? AND  video_id_PK!=?',[video_title,chapter_id,video_id]);
  return rows[0];
}

static async updateVideo({
  video_id,
  chapter_id_FK,
  video_title,
  video_hindi,
  video_english,
  description,
  thumbnail_url,
  duration,
  video_type,
  is_paid
}) {
  const [rows] = await db.query(`
    UPDATE tbl_chapter_videos 
    SET chapter_id_FK = ?, video_title = ?, video_url_hindi = ?, video_url_english = ?, 
        description = ?, thumbnail_url = ?, duration = ?, video_type = ?, is_paid = ?
    WHERE video_id_PK = ?
  `, [
    chapter_id_FK,
    video_title,
    video_hindi,
    video_english,
    description,
    thumbnail_url,
    duration,
    video_type,
    is_paid,
    video_id
  ]);

  return rows.affectedRows;
}

static async getFavouriteVideoIdsByUser(user_id) {
    const [rows] = await db.query(
      `SELECT video_id_FK FROM tbl_favorites_video WHERE user_id_FK = ?`,
      [user_id]
    );
    return rows.map(row => row.video_id_FK);
  }

  static async getSearchVideo(query){
     const [videos] = await db.query(
      `SELECT * FROM tbl_chapter_videos WHERE 	video_title LIKE ?  LIMIT 5`,
      [query]
    );

    return videos;
  }

  static async getSearchNotes(query){
    const [notes] = await db.query(
      `SELECT * FROM tbl_chapter_notes WHERE pdf_title LIKE ? LIMIT 5`,
      [query]
    );
 return notes;
  }
static async getSearchTestPaper(query){
   const [testpapers] = await db.query(
      `SELECT * FROM tbl_chapter_testpapers WHERE pdf_title LIKE ? LIMIT 5`,
      [query]
    );
return testpapers;
}
   
static async getSearchQuiz(query){
const [quizzes] = await db.query(
      `SELECT * FROM tbl_quizzes WHERE	title LIKE ? LIMIT 5`,
      [query]
    );
    return quizzes;
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



static async adNotifictionInDb({ className, subjectName, chapterName, video_title }) {
  const [rows] = await db.query(
    `INSERT INTO tbl_notifications (class_name, subject_name, chapter_name, content_title, content_type) VALUES (?, ?, ?, ?, ?)`,
    [className, subjectName, chapterName, video_title,'Video']
  );
  return rows.insertId > 0;
}

}

module.exports=Video;