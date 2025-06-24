const db = require('../database/db');

class Users{

static async getUserList(){
    const [rows]=await db.query('SELECT * from tbl_users');
    return rows;
}
  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM tbl_users WHERE email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
  }



   static async registerUser({ full_name, mobile, email, password,provider_id,signIn_method,jwt_token,referral_code }) {
    const [result] = await db.query(
      'INSERT INTO tbl_users (full_name, mobile, email, password,provider_id,signIn_method,jwt_token,referral_code) VALUES (?, ?, ?, ?,?,?,?,?)',
      [full_name, mobile, email, password,provider_id,signIn_method,jwt_token,referral_code]
    );
    return result.insertId;
  }

   static async updateToken({user_id,token}) {
   
  const [rows]=  await db.query(
      'UPDATE tbl_users SET jwt_token = ? WHERE user_id_PK = ?',
      [token, user_id]
    );
return rows.affectedRows>0
  }


  static async updatePassword(email, newPassword) {
 const [rows]= await db.query(
    'UPDATE tbl_users SET password = ? WHERE email = ?',
    [newPassword, email]
  );
  console.log("rows.affectedRows>0",rows.affectedRows>0)
  return rows.affectedRows>0
}
}
module.exports=Users;