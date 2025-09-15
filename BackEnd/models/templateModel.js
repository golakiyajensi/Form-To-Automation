// models/templateModel.js
const db = require("../config/db");

const Template = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM tbl_templates");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM tbl_templates WHERE id = ?", [id]);
    return rows[0];
  },

  getFields: async (id) => {
    const [rows] = await db.query(
      "SELECT * FROM tbl_template_fields WHERE template_id = ? ORDER BY sort_order",
      [id]
    );
    return rows;
  },

  useTemplate: async (templateId, userId) => {
    const [rows] = await db.query("CALL sp_create_form_from_template(?, ?)", [
      templateId,
      userId,
    ]);
    return rows[0][0];
  },
};

module.exports = Template;
