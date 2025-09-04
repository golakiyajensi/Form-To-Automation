const db = require("../config/db");

const saveResponseSettings = async (settings) => {
  const [rows] = await db.query(
    "CALL sp_save_response_settings(?,?,?,?,?,?,?,?)",
    [
      settings.form_id,
      settings.collect_email,
      settings.send_copy,
      settings.allow_edit,
      settings.limit_one_response,
      settings.store_in_sheet,
      settings.sheet_url,
      settings.is_accepting,
    ]
  );
  return rows;
};

const getResponseSettings = async (form_id) => {
  const [rows] = await db.query("CALL sp_get_response_settings(?)", [form_id]);
  return rows[0]?.[0] || null;
};

module.exports = { saveResponseSettings, getResponseSettings };
