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
  // call with 7 arguments now
  const sql = `
    CALL sp_login_user(?, @status, @user_id, @role, @name, @password, @is_verified);
    SELECT @status AS status, @user_id AS user_id, @role AS role, @name AS name, @password AS password, @is_verified AS is_verified;
  `;
  const [resultSets] = await db.query(sql, [email]);

  const rows = resultSets[1]; // second result set has the SELECT
  if (!rows || rows.length === 0) {
    return { status: "USER_NOT_FOUND" };
  }

  const { status, user_id, role, name, password: dbPassword, is_verified } = rows[0];
  return { status, user_id, role, name, password: dbPassword, is_verified };
};


const getAllUsers = async () => {
  const [rows] = await db.query(
    "SELECT user_id, name, email, role, created_at, updated_at FROM tbl_user ORDER BY user_id"
  );
  return rows;
};

const updateUserRole = async (user_id, role) => {
  const [results] = await db.query("CALL sp_update_user_role(?,?)", [
    user_id,
    role,
  ]);
  return results[0] ? results[0][0] : null;
};

const deleteUser = async (user_id) => {
  const [rows] = await db.query("CALL sp_delete_user(?)", [user_id]);
  return rows[0][0]; // {status: 'deleted'} or {status: 'not_found'}
};

// Find user by email
const findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM tbl_user WHERE email = ?", [
    email,
  ]);
  return rows.length > 0 ? rows[0] : null;
};

// Save reset token
const saveResetToken = async (user_id, token, expiry) => {
  await db.query(
    "UPDATE tbl_user SET reset_token = ?, reset_token_expiry = ? WHERE user_id = ?",
    [token, expiry, user_id]
  );
};

// Reset user password
const resetUserPassword = async (token, hashedPassword) => {
  const [rows] = await db.query(
    "SELECT * FROM tbl_user WHERE reset_token = ? AND reset_token_expiry > NOW()",
    [token]
  );

  if (rows.length === 0) return false;

  const user_id = rows[0].user_id;

  await db.query(
    "UPDATE tbl_user SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE user_id = ?",
    [hashedPassword, user_id]
  );

  return true;
};

// Save OTP + expiry (60s)
const setUserOtpById = async (user_id, otp, expiry) => {
  await db.query(
    "UPDATE tbl_user SET otp_code = ?, otp_expiry = ? WHERE user_id = ?",
    [otp, expiry, user_id]
  );
};

// Save OTP + expiry by email
const setUserOtpByEmail = async (email, otp, expiry) => {
  await db.query(
    "UPDATE tbl_user SET otp_code = ?, otp_expiry = ? WHERE email = ?",
    [otp, expiry, email]
  );
};

// Fetch by email (full row)
const getUserByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM tbl_user WHERE email = ? LIMIT 1",
    [email]
  );
  return rows.length ? rows[0] : null;
};

// Fetch user by user_id
const getUserById = async (userId) => {
  const [rows] = await db.query(
    "SELECT user_id, name, email, role, is_verified FROM tbl_user WHERE user_id = ? LIMIT 1",
    [userId]
  );
  return rows.length ? rows[0] : null;
};


// Mark verified and clear OTP
const verifyUserByEmailAndOtp = async (email, otp) => {
  const [rows] = await db.query(
    "SELECT user_id, otp_expiry FROM tbl_user WHERE email = ? AND otp_code = ? LIMIT 1",
    [email, otp]
  );
  if (!rows.length) return { ok: false, reason: "INVALID_OTP" };

  const { user_id, otp_expiry } = rows[0];
  if (!otp_expiry || new Date(otp_expiry) <= new Date()) {
    return { ok: false, reason: "OTP_EXPIRED" };
  }

  await db.query(
    "UPDATE tbl_user SET is_verified = 1, otp_code = NULL, otp_expiry = NULL WHERE user_id = ?",
    [user_id]
  );
  return { ok: true };
};

// Clear OTP (on resend)
const clearOtpByEmail = async (email) => {
  await db.query(
    "UPDATE tbl_user SET otp_code = NULL, otp_expiry = NULL WHERE email = ?",
    [email]
  );
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  updateUserRole,
  deleteUser,
  findUserByEmail,
  saveResetToken,
  resetUserPassword,
  setUserOtpById,
  setUserOtpByEmail,
  getUserByEmail,
  getUserById,
  verifyUserByEmailAndOtp,
  clearOtpByEmail,
};
