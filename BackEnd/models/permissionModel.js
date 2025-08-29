const db = require("../config/db");

const shareForm = async (form_id, user_id, permission) => {
  await db.query("CALL sp_share_form(?, ?, ?)", [form_id, user_id, permission]);
  return { form_id, user_id, permission };
};

const getFormUsers = async (form_id) => {
  const [rows] = await db.query("CALL sp_get_form_users(?)", [form_id]);
  return rows[0];
};

const updatePermission = async (permission_id, permission) => {
  await db.query("CALL sp_update_permission(?, ?)", [permission_id, permission]);
  return { permission_id, permission };
};

const deletePermission = async (permission_id) => {
  const [rows] = await db.query("CALL sp_delete_permission(?)", [permission_id]);
  return rows[0][0];
};

module.exports = { shareForm, getFormUsers, updatePermission, deletePermission };
