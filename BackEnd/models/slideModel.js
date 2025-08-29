const db = require("../config/db");

const addSlide = async (form_id, title, description, order_no, fields) => {
  const [rows] = await db.query("CALL sp_add_slide_with_fields(?,?,?,?)", [
    form_id,
    title,
    description,
    order_no,
  ]);

  const slide_id = rows[0][0].slide_id;

  // Insert fields
  for (let f of fields) {
    await db.query("CALL sp_add_slide_field(?,?,?,?,?)", [
      slide_id,
      f.label,
      f.field_type,
      f.is_required,
      JSON.stringify(f.options || null),
    ]);
  }

  return { slide_id, form_id, title, description, order_no, fields };
};

module.exports = { addSlide };
