const db=require("../database/db")

class Organization{


    static async isOrganizationExist(organization_name){
const [rows]=await db.query(`SElECT * from tbl_organization where organization_name=?`,[organization_name] );
return rows[0];


    }
static async addOrganization({ organization_name, address, email, phone, business_hours }) {
  const [rows] = await db.query(
    `INSERT INTO tbl_organization (organization_name, address, email, phone, business_hours) VALUES (?, ?, ?, ?, ?)`,
    [organization_name, address, email, phone, business_hours]
  );
  return rows.insertId;
}

static async getOrganizationDetail(organization_name = 'Visual Learning') {
  const [rows] = await db.query(
    `SELECT * FROM tbl_organization WHERE organization_name = ?`,
    [organization_name]
  );
  return rows[0];
}


static async uploadImage({title,imageUrl}){
  const [rows]=await db.query(`INSERT into tbl_banner_images(	image_url,title) value(?,?)`,[imageUrl,title]);
  return rows.insertId
};
//get all banner image list
static async bannerImagesList(){
  const [rows]=await db.query(`SELECT * from tbl_banner_images where is_active=1`);
  return rows;
}

static async deleteBannerImage(image_id){
const [rows]=await db.query(`DELETE from tbl_banner_images  where image_id_PK =?`,[image_id]);
return rows.affectedRows>0;
}


}

module.exports=Organization;