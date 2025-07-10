const db=require("../database/db")

class Category{

    static async getCategoryList(){
        const [rows]=await db.query("SELECT * from tbl_categories");
        return rows;
        
    }


 static async findByName(name) {
    const [rows] = await db.query('SELECT * FROM tbl_categories WHERE category_name = ?', [name]);
    return rows.length > 0 ? rows[0] : null;
  }


  static async addCategory({ category_name,icon }) {
    const [result] = await db.query(
      `INSERT INTO tbl_categories (category_name,category_icon) VALUES (?, ?)`,
      [category_name,icon]
    );
    return result.insertId;
  }

static async deleteCategory(id){
    const [result] = await db.query(
      "DELETE FROM tbl_categories WHERE category_id_PK = ?",
      [id]
    );
    return result.affectedRows > 0;
}


//get all banner image list
static async bannerImagesList(){
  const [rows]=await db.query(`SELECT * from tbl_banner_images where is_active=1`);
  return rows;
}


static async getCategoryById(category_id){
  const [rows]=await db.query(`SELECT * from  tbl_categories where category_id_PK=?`,[category_id]);

 
  return rows[0];
}

static async updateCategory({category_id,category_name,category_icon}){
  const [rows]=await db.query(`UPDATE tbl_categories SET category_name = ?, category_icon = ? WHERE category_id_PK = ?`,[category_name,category_icon,category_id]);
  return rows.affectedRows>0;
}

}

module.exports=Category;