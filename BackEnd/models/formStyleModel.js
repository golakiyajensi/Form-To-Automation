const db = require("../config/db");

// Save or update style
const saveFormStyle = async (form_id, primary_color, background_color, font_family) => {
  await db.query("CALL sp_save_form_style(?,?,?,?)", [
    form_id,
    primary_color,
    background_color,
    font_family,
  ]);
};

// Get style by form_id
const getFormStyle = async (form_id) => {
  const [rows] = await db.query("CALL sp_get_form_style(?)", [form_id]);
  return rows[0]; // first result set
};

module.exports = {
  saveFormStyle,
  getFormStyle,
};
