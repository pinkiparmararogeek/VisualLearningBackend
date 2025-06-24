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
}


module.exports=SubscriptionPlan;