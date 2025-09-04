const db = require("../config/db");
const bcrypt = require("bcryptjs");

const registerUser = async (name, email, password, role = "viewer") => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [results] = await db.query(
      "CALL sp_register_user(?, ?, ?, ?, @status, @user_id); SELECT @status AS status, @user_id AS user_id;",
      [name, email, hashedPassword, role]
    );

    const { status, user_id } = results[1][0];
    return { status, user_id };
  } catch (err) {
    throw err;
  }
};

const loginUser = async (email, password) => {
  try {
    const [results] = await db.query(
      "CALL sp_login_user(?, @status, @user_id, @role, @name, @password); SELECT @status AS status, @user_id AS user_id, @role AS role, @name AS name, @password AS password;",
      [email]
    );

    const output = results[1][0];

    if (output.status === "USER_NOT_FOUND") {
      return { status: "USER_NOT_FOUND" };
    }

    // Compare bcrypt hash
    const isMatch = await bcrypt.compare(password, output.password);
    if (!isMatch) {
      return { status: "INVALID_PASSWORD" };
    }

    return {
      status: "SUCCESS",
      user_id: output.user_id,
      role: output.role,
      name: output.name,
    };
  } catch (err) {
    throw err;
  }
}; 

const getAllUsers = async () => {
    const [rows] = await db.query("SELECT user_id, name, email, role, created_at, updated_at FROM tbl_user ORDER BY user_id");
    return rows;
};

const updateUserRole = async (user_id, role) => {
  const [results] = await db.query("CALL sp_update_user_role(?,?)", [user_id, role]);
  return results[0] ? results[0][0] : null;
};

const deleteUser = async (user_id) => {
  const [rows] = await db.query("CALL sp_delete_user(?)", [user_id]);
  return rows[0][0]; // {status: 'deleted'} or {status: 'not_found'}
};


// Find user by email
const findUserByEmail = async (email) => {
    const [rows] = await db.query("SELECT * FROM tbl_user WHERE email = ?", [email]);
    return rows.length > 0 ? rows[0] : null;
};

// Save reset token
const saveResetToken = async (user_id, token, expiry) => {
    await db.query("UPDATE tbl_user SET reset_token = ?, reset_token_expiry = ? WHERE user_id = ?", [token, expiry, user_id]);
};

// Reset user password
const resetUserPassword = async (token, hashedPassword) => {
    const [rows] = await db.query(
        "SELECT * FROM tbl_user WHERE reset_token = ? AND reset_token_expiry > NOW()",
        [token]
    );

    if (rows.length === 0) return false;

    const user_id = rows[0].user_id;

    await db.query("UPDATE tbl_user SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE user_id = ?", [hashedPassword, user_id]);

    return true;
};

module.exports = { registerUser, loginUser, getAllUsers, updateUserRole, deleteUser, findUserByEmail, saveResetToken, resetUserPassword };