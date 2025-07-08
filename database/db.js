const mysql = require("mysql2");
const dbConfig = require("./config");

const db = mysql.createPool(dbConfig);
  
// Use the promise-based API
const promiseDb = db.promise();

// Test the connection
const testConnection = async () =>{
    try {
        const [rows, fields] = await promiseDb.query('SELECT 1');
        console.log("Database connected...");
    } catch (err) {
        console.error("Error connecting to the database:", err);
    }
};

testConnection();

//Export the promise-based db connection
module.exports = promiseDb;
