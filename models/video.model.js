const db=require("../database/db")

class Video{

static async uploadVideo({chapter_id, video_title, video_url, description, thumbnail_url, duration,video_type }){
    const [rows]=await db.query(`
      INSERT INTO tbl_chapter_videos 
        (chapter_id_FK, video_title, video_url, description, thumbnail_url, duration,video_type)
      VALUES (?, ?, ?, ?, ?, ?,?)`,
      [chapter_id, video_title, video_url, description, thumbnail_url, duration,video_type]
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
}

module.exports=Video;