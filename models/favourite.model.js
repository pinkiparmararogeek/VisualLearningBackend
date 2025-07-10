const db=require("../database/db")

class Favourite{

static async markFavourite(user_id, video_id) {
  const [rows] = await db.query(
    `INSERT INTO tbl_favorites_video (video_id_FK, user_id_FK) VALUES (?, ?)`,
    [video_id, user_id]
  );
  return rows.insertId;
}
static async isFavouriteExist(user_id ,video_id){
    const[rows]=await db.query('SELECT * from tbl_favorites_video where video_id_FK=? and user_id_FK=?',[video_id,user_id]);
    return rows[0];
}

static async removeFavourite(user_id ,video_id){
    const[rows]=await db.query('DELETE from tbl_favorites_video where video_id_FK =? and user_id_FK=?',[video_id,user_id]);
    return rows.affectedRows>0;
}

// static async getFavouriteVideoListByUserId(user_id){
//     const[rows]=await db.query(`SELECT f.* ,v.video_title,v.video_url_hindi,v.video_url_english,v.video_type,v.description,v.is_paid,v.thumbnail_url,v.duration
//         from tbl_favorites_video as f 
//         LEFT JOIN tbl_chapter_videos as v ON v.video_id_PK=f.video_id_FK
//         where f.user_id_FK=?
// `,[user_id])

// return rows;
// }

static async getFavouriteVideoListByUserId(user_id) {
  const [rows] = await db.query(`
    SELECT 
      f.*, 
      v.video_title, 
      v.video_url_hindi, 
      v.video_url_english, 
      v.video_type, 
      v.description, 
      v.is_paid, 
      v.thumbnail_url, 
      v.duration,
      c.chapter_name,
      s.subject_name,
      cl.class_name
    FROM tbl_favorites_video AS f
    LEFT JOIN tbl_chapter_videos AS v ON v.video_id_PK = f.video_id_FK
    LEFT JOIN tbl_chapter AS c ON v.chapter_id_FK = c.chapter_id_PK
    LEFT JOIN tbl_subjects AS s ON c.subject_id_FK = s.subject_id_PK
    LEFT JOIN tbl_classes AS cl ON s.class_id_FK = cl.class_id_PK
    WHERE f.user_id_FK = ?
  `, [user_id]);

  return rows;
}


    }

module.exports=Favourite;