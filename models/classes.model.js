const db=require("../database/db")

class Classes{
    static async findClass({class_name}){
        const [rows]=await db.query(`select * from tbl_classes where class_name=? `,[class_name]);
        return rows[0];
    } 


static async findSortOrder(sort_order) {
    const [rows] = await db.query(
        `SELECT * FROM tbl_classes WHERE sort_order = ?`,
        [sort_order]
    );
    return rows[0]; 
}



    static async classList(){
      const [rows]=await db.query(`SELECT * FROM tbl_classes ORDER BY sort_order ASC;`);
      return rows;
    }
static async addClass({sort_order,class_name,icon}){
    const [insert]=await db.query(`insert into tbl_classes (sort_order,class_name,class_icon) VALUES (?,?,?)`,[sort_order,class_name,icon])
    return insert.insertId;
}



static async deleteClass(class_id) {
  const [result] = await db.query(
    `DELETE FROM tbl_classes WHERE class_id_PK = ?`,
    [class_id]
  );
  return result.affectedRows > 0;
}


//get  all subject with chapter by class Name
static async classDetails(class_id){



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
      WHERE c.class_id_PK = ?
    `, [class_id]);

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
      class_id,
      subjects: Object.values(subjectMap)
    };
    return result;
}

static async getClassById(class_id){
  const [rows]=await db.query(`SELECT * from  tbl_classes where class_id_PK=?`,[class_id]);

 
  return rows[0];
}


static async duplicateClassName(class_id,class_name){
  const [rows]=await db.query(`Select * from tbl_classes where class_name=? AND class_id_PK!=?`,[class_name,class_id]);
  return rows[0];
}




static async duplicateSortOrder(class_id,sort_order){
  const [rows]=await db.query(`Select * from tbl_classes where sort_order=? AND class_id_PK!=?`,[sort_order,class_id]);
  return rows[0];
}


static async updateClassInfo({class_id,class_name,sort_order,class_icon}){
  const [rows]=await db.query(`UPDATE tbl_classes SET class_name = ?, sort_order = ?, class_icon = ? WHERE class_id_PK = ?`,[class_name,sort_order,class_icon,class_id]);
  return rows.affectedRows>0;
}

static async statusUpdateClass(class_id,status){
  const [rows]=await db.query(`UPDATE tbl_classes SET is_active=? where class_id_PK=?`,[status,class_id]);
  return rows.affectedRows>0;
}
}

module.exports=Classes