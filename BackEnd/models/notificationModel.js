const db = require("../config/db");

const getNotificationSettings = async (user_id) => {
  const [rows] = await db.query("CALL sp_get_notification_settings(?)", [user_id]);
  return rows[0] && rows[0].length > 0 ? rows[0][0] : null;
};


const updateSettings = async (user_id, data) => {
  const { email_enabled, sms_enabled, in_app_enabled, frequency } = data;

  const [rows] = await db.query(
    "CALL sp_update_notification_settings(?,?,?,?,?)",
    [user_id, email_enabled, sms_enabled, in_app_enabled, frequency]
  );

  return rows[0][0];
};

module.exports = { getNotificationSettings, updateSettings };
