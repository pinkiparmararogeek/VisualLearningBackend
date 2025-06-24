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

}

module.exports=Organization;