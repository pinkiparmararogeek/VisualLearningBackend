const db=require("../database/db")

class Classes{
    static async findClass({category_id,class_name}){
        const [rows]=await db.query(`select * from tbl_classes where class_name=? AND category_id_FK=?`,[class_name,category_id]);
        return rows[0];
    } 

static async addClass({category_id,class_name,icon}){
    const [insert]=await db.query(`insert into tbl_classes (category_id_FK,class_name,class_icon) VALUES (?,?,?)`,[category_id,class_name,icon])
    return insert.insertId;
}


static async getClassListByCategory(category_id) {
  const [rows] = await db.query(
    `SELECT * FROM tbl_classes WHERE category_id_FK = ?`,
    [category_id]
  );
  return rows;
}

static async deleteClass(class_id) {
  const [result] = await db.query(
    `DELETE FROM tbl_classes WHERE class_id_PK = ?`,
    [class_id]
  );
  return result.affectedRows > 0;
}


//get  all subject with chapter by class Name
static async classDetails(class_name){



      const [rows] = await db.query(`
      SELECT 
        c.class_name,
        s.subject_id_PK AS subject_id,
        s.subject_name,
        ch.chapter_id_PK AS chapter_id,
        ch.chapter_name
        FROM tbl_classes c
      JOIN tbl_subjects s ON s.class_id_FK = c.class_id_PK
      LEFT JOIN tbl_chapter ch ON ch.subject_id_FK = s.subject_id_PK
      WHERE c.class_name = ?
    `, [class_name]);

    const subjectMap = {};

    rows.forEach(row => {
      if (!subjectMap[row.subject_id]) {
        subjectMap[row.subject_id] = {
          subject_id: row.subject_id,
          subject_name: row.subject_name,
          chapters: []
        };
      }
      if (row.chapter_id) {
        subjectMap[row.subject_id].chapters.push({
          chapter_id: row.chapter_id,
          chapter_name: row.chapter_name,
          language_type: row.language_type
        });
      }
    });
    const result = {
      class_name,
      subjects: Object.values(subjectMap)
    };
    return result;
}


}

module.exports=Classes