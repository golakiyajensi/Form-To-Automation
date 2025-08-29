const db = require("../config/db");

const getSystemConfig = async () => {
  const [rows] = await db.query("CALL sp_get_system_config()");
  return rows[0][0];
};

const updateSystemConfig = async (data) => {
  const { logo_url, company_name, theme_color, default_font, password_policy } = data;
  const [rows] = await db.query(
    "CALL sp_update_system_config(?,?,?,?,?)",
    [logo_url, company_name, theme_color, default_font, password_policy]
  );
  return rows[0][0];
};

module.exports = { getSystemConfig, updateSystemConfig };
