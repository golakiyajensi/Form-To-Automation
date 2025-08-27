const db = require("../config/db");

const registerUser = async (name, email, password, role = "viewer") => {
  try {
    const [results] = await db.query(
      "CALL sp_register_user(?, ?, ?, ?, @status, @user_id); SELECT @status AS status, @user_id AS user_id;",
      [name, password, email, role]
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
      "CALL sp_login_user(?, ?, @status, @user_id, @role, @name); SELECT @status AS status, @user_id AS user_id, @role AS role, @name AS name;",
      [email, password]
    );

    const { status, user_id, role, name } = results[1][0];
    return { status, user_id, role, name };
  } catch (err) {
    throw err;
  }
};

const getAllUsers = async () => {
    const [rows] = await db.query("SELECT user_id, name, email, role, created_at, updated_at FROM tbl_user ORDER BY user_id");
    return rows;
};

const updateUserRole = async (user_id, role) => {
    const [rows] = await db.query("CALL sp_update_user_role(?,?)", [user_id, role]);
    return rows[0][0]; // return updated user
};

const deleteUser = async (user_id) => {
    await db.query("CALL sp_delete_user(?)", [user_id]);
    return true;
};

module.exports = { registerUser, loginUser, getAllUsers, updateUserRole, deleteUser };
