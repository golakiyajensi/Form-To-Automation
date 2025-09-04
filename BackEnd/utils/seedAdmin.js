const db = require("../config/db");
const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
    const adminName = process.env.DEFAULT_ADMIN_NAME || "Super Admin";

    // Admin already exist check
    const [rows] = await db.query(
      "SELECT * FROM tbl_user WHERE email = ? LIMIT 1",
      [adminEmail]
    );

    if (rows.length > 0) {
      console.log("✅ Default admin already exists");
      return;
    }

    // Password hash
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Insert default admin
    await db.query(
      "INSERT INTO tbl_user (name, email, password, role) VALUES (?, ?, ?, ?)",
      [adminName, adminEmail, hashedPassword, "admin"]
    );

    console.log(`🚀 Default admin created:
      Email: ${adminEmail}
      Password: ${adminPassword} 
      (⚠️ Please change after first login)`);
  } catch (err) {
    console.error("❌ Error seeding admin:", err.message);
  }
};

module.exports = seedAdmin;
