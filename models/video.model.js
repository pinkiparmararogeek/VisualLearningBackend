const db=require("../database/db")

class Video{

static async uploadVideo({chapter_id, video_title, video_url, description, thumbnail_url, duration }){
    const [rows]=await db.query(`
      INSERT INTO tbl_chapter_videos 
        (chapter_id_FK, video_title, video_url, description, thumbnail_url, duration)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [chapter_id, video_title, video_url, description, thumbnail_url, duration]
    );
return rows.insertId;
}
}

module.exports=Video;