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

module.exports = { registerUser, loginUser };
