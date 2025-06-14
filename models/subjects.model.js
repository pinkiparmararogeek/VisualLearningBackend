const db=require("../database/db")

class Subjects{
static async isSubjectExist({subject_name,class_id}){
    const [rows]=await db.query('Select * from tbl_subjects where subject_name=? AND class_id_FK=?',[subject_name,class_id])
return rows[0]
}
static async addSubject({subject_name,class_id}){
    const [insert]=await db.query("insert into tbl_subjects (subject_name,class_id_FK) values(?,?)",[subject_name,class_id]);

    return insert.insertId;
}

static async getSubjectsByClassName(class_name) {
  const [rows] = await db.query(
    `SELECT 
       s.subject_id_PK, s.subject_name, 
       c.class_id_PK, c.class_name
     FROM 
       tbl_subjects s
     JOIN 
       tbl_classes c ON c.class_id_PK = s.class_id_FK
     WHERE 
       c.class_name = ?`,
    [class_name]
  );
  return rows;
}


static async deleteSubject(subject_id){
    const [rows]=await db.query('DELETE from tbl_subjects where subject_id_PK=?',[subject_id]);
    return rows.affectedRows > 0;
}




}

module.exports=Subjects