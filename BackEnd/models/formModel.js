const db = require('../config/db');

module.exports = {
 createForm: async (title, description, createdBy) => {
  const [rows] = await db.query("CALL sp_create_form(?, ?, ?)", [
    title,
    description,
    createdBy
  ]);
  return rows[0][0]; // { form_id, share_url }
},


  getFormById: async (formId) => {
    const [rows] = await db.query("CALL sp_get_form_by_id(?)", [formId]);
    return rows[0][0];
  },

  getAllForms: async () => {
    const [rows] = await db.query("CALL sp_get_all_forms()");
    return rows[0];
  },

  updateForm: async (formId, title, description) => {
    await db.query("CALL sp_update_form(?, ?, ?)", [formId, title, description]);
    return true;
  },

  deleteForm: async (formId) => {
  await db.query("CALL sp_delete_form(?, @status)", [formId]);
  const [[{ status }]] = await db.query("SELECT @status AS status");
  return status;
},
getSlidesWithFields: async (formId) => {
  const [rows] = await db.query("CALL sp_get_slides_with_fields(?)", [formId]);
  return {
    slides: rows[0],   // slides
    fields: rows[1]    // fields for those slides
  };
}

};
