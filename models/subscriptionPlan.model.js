const db=require("../database/db")

class SubscriptionPlan{





static async addPlan({plan_name,price,offer_price,duration_days	}){
    const[rows]=await db.query(`INSERT into tbl_subscription_plans(plan_name,price,offer_price,duration_days) values(?,?,?,?)`,[plan_name,price,offer_price,duration_days]);
    return rows.insertId;
}

static async isPlanExist(plan_name){
    const [rows]=await db.query("SELECT * from tbl_subscription_plans where plan_name=?",[plan_name]);
    return rows[0];
}


static async getAllPlans(){
    const [rows]=await db.query(`SELECT * from tbl_subscription_plans where is_active=1`);
    return rows;
}


static async getPlanList(){
    const [rows]=await db.query(`SELECT * from tbl_subscription_plans`);
    return rows;
}


 static async getPlanById(plan_id){
    const [rows]=await db.query(`SELECT * from tbl_subscription_plans where plan_id_PK=?`,[plan_id]);
    return rows[0];
 }
static async purchasePlan({ plan_id, user_id, startDate, endDate }) {
  // 1. Insert into subscription table
  const [rows] = await db.query(
    `INSERT INTO tbl_user_subscriptions (user_id_FK, subscription_plan_id_FK, start_date, end_date) VALUES (?, ?, ?, ?)`,
    [user_id, plan_id, startDate, endDate]
  );
  if (rows.insertId > 0) {
    // 2. Update user subscription status
    await db.query(
      `UPDATE tbl_users SET is_subscribe = ?, expiry_date = ? WHERE user_id_PK= ?`,
      [2, endDate, user_id]
    );
    // 3. Return the inserted subscription ID
    return rows.insertId;
  } else {
    throw new Error('Failed to insert subscription');
  }
}


static async getUserSubscriptionDetail(user_id) {
  const [rows] = await db.query(`
    SELECT s.*, p.plan_name, p.price, p.offer_price, p.duration_days
    FROM tbl_user_subscriptions AS s
    LEFT JOIN tbl_subscription_plans AS p ON s.subscription_plan_id_FK = p.plan_id_PK
    WHERE s.user_id_FK = ?
  `, [user_id]);
  return rows[0]; // or return rows if expecting multiple
}

static async getUsersWithExpiryToday(today) {
    const [users] = await db.query(
      `SELECT user_id_PK FROM tbl_users WHERE expiry_date = ?`,
      [today]
    );
    return users;
  }

  static async updateUserSubscriptionStatus(userId, today) {
    const [rows]=await db.query(`UPDATE tbl_users SET is_subscribe = 1 WHERE user_id_PK = ? AND expiry_date = ?`,[userId, today]);
    return  rows.affectedRows>0;
   
  }
  static async deactivateUserSubscription(userId, date) {
  const query = `
    UPDATE tbl_user_subscriptions
    SET is_active = 2
    WHERE user_id_FK = ?
      AND end_date = ?
  `;
  return await db.query(query, [userId, date]);
}


static async getSubscriptionList(){
    const [rows]=await db.query(`SELECT s.*,u.full_name,u.email,p.plan_name
         from tbl_user_subscriptions as s
         LEFT JOIN  tbl_users as u ON u.user_id_PK=s.user_id_FK
         LEFT JOIN tbl_subscription_plans as p ON s.subscription_plan_id_FK=p.plan_id_PK
         `)

         return rows;
}


static async updateSubscriptionStatus(plan_id, status){
   const [result] = await db.query(
      "UPDATE tbl_subscription_plans SET 	is_active = ? WHERE plan_id_PK = ?",
      [status,plan_id]
    );
    return result;
}
}


module.exports=SubscriptionPlan;