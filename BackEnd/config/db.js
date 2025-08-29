const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});

// test connection
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ Database connected successfully");
    connection.release(); // release connection back to pool
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
})();

module.exports = db;
