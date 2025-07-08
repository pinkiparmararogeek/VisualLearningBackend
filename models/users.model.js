const db = require('../database/db');

class Users{



static async getUserList({ limit, offset }) {
  const [users] = await db.query(
    `SELECT 
       u.*,
       ref.email AS referred_by_email
     FROM 
       tbl_users u
     LEFT JOIN 
       tbl_users ref ON u.referred_by_Id = ref.user_id_PK
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  return users;
}

static async findeReferredById(referred_code){
  const [rows]=await db.query(`SELECT * from tbl_users where referral_code=?`,[referred_code]);
 return rows.length > 0 ? rows[0].user_id_PK : null;
}
static async getUserCount() {
  const [rows] = await db.query('SELECT COUNT(*) AS count FROM tbl_users');
  return rows[0].count;
}


static async getTotalActiveUser(){
  const [rows]=await db.query(`SELECT COUNT(*) AS count from tbl_users where is_active=1`)
  return rows[0].count;
}
  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM tbl_users WHERE email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
  }



   static async registerUser({ full_name, mobile, email, password,provider_id,signIn_method,jwt_token,referred_by_Id ,referral_code}) {
    const [result] = await db.query(
      'INSERT INTO tbl_users (full_name, mobile, email, password,provider_id,signIn_method,jwt_token,referred_by_Id,referral_code) VALUES (?, ?, ?, ?,?,?,?,?,?)',
      [full_name, mobile, email, password,provider_id,signIn_method,jwt_token,referred_by_Id,referral_code]
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


// logout user by expiring JWT token
static async logOutUser(token) {
  const [expire] = await db.query(
    `UPDATE tbl_users SET jwt_token = NULL WHERE jwt_token = ?`,
    [token]
  );
  return expire.affectedRows>0;
}

static async extendSubscription(userId) {
  // Get current expiry_date for the user
  const [rows] = await db.query(
    "SELECT expiry_date FROM tbl_users WHERE user_id_PK = ?",
    [userId]
  );

  let currentExpiry = new Date();

  if (rows.length > 0 && rows[0].expiry_date) {
    currentExpiry = new Date(rows[0].expiry_date);
  } else {
    console.log("No expiry date found or user not found.");
  }

  // Add 7 days
  const newExpiry = new Date(currentExpiry);
  newExpiry.setDate(newExpiry.getDate() + 7);

  // Format to 'YYYY-MM-DD HH:MM:SS' for SQL
  const formattedExpiry = newExpiry.toISOString().slice(0, 19).replace("T", " ");

  // Update expiry_date and is_subscribe in database
  await db.query(
    "UPDATE tbl_users SET expiry_date = ?, is_subscribe = 2 WHERE user_id_PK = ?",
    [formattedExpiry, userId]
  );
}



static async extendSubscriptionPlanAfterPlanPurchase(userId) {
  // Get current expiry_date for the user
  const [rows] = await db.query(
    "SELECT expiry_date FROM tbl_users WHERE user_id_PK = ?",
    [userId]
  );
  let baseDate = new Date(); // Default to today
  if (rows.length > 0 && rows[0].expiry_date) {
    baseDate = new Date(rows[0].expiry_date); // Use existing expiry
  }
  // Always add 8 days
  baseDate.setDate(baseDate.getDate() + 8);
  // Format to 'YYYY-MM-DD HH:MM:SS'
  const formattedExpiry = baseDate.toISOString().slice(0, 19).replace("T", " ");
  // Update expiry_date and is_subscribe in the database
 const [result]= await db.query(
    "UPDATE tbl_users SET expiry_date = ?, is_subscribe = 2 WHERE user_id_PK = ?",
    [formattedExpiry, userId]
  );
 return result.affectedRows > 0;
}

// Get user by ID
static async getUserById(user_id) {
  const [rows] = await db.query(`SELECT * FROM tbl_users WHERE user_id_PK = ?`, [user_id]);
  return rows.length > 0 ? rows[0] : null;
}


static async addFcmToken({user_id, fcm_token}){
  const [rows]=await db.query(`UPDATE tbl_users SET fcm_token=? where user_id_PK=?`,[fcm_token,user_id]);
   return rows.affectedRows > 0;
}

static async getNotificationList(){
  const [rows]=await db.query(`SELECT * from tbl_notifications `)
  return rows;
}
}
module.exports=Users;