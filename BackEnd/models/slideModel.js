const db = require("../config/db");

// ✅ Create Slide
const createSlide = async (form_id, title, description, order_no, title_formatted, description_formatted) => {
  const [result] = await db.query(
    `INSERT INTO tbl_form_slides 
     (form_id, title, description, order_no, title_formatted, description_formatted) 
     VALUES (?,?,?,?,?,?)`,
    [form_id, title, description, order_no, JSON.stringify(title_formatted || null), JSON.stringify(description_formatted || null)]
  );

  return {
    id: result.insertId,
    form_id,
    title,
    description,
    order_no,
    title_formatted,
    description_formatted
  };
};

// ✅ Add fields in bulk
const addFieldsBulk = async (slide_id, fields) => {
  const created = [];
  const fieldTypeMap = {
    text: "short_text",
    email: "short_text",
    number: "short_text",
    dropdown: "dropdown",
    textarea: "paragraph",
    checkbox: "checkbox",
    radio: "multiple_choice",
    file: "file_upload",
    date: "date",
    time: "time",
    scale: "linear_scale",
  };

  for (const f of fields) {
    const fieldType = fieldTypeMap[f.type];
    if (!fieldType) throw new Error(`Unsupported field type: ${f.type}`);

    const [result] = await db.query(
      `INSERT INTO tbl_form_fields 
       (form_id, slide_id, label, description, field_type, is_required, options, response_validation, order_no) 
       VALUES ((SELECT form_id FROM tbl_form_slides WHERE id=?), ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slide_id,
        slide_id,
        f.label,
        f.description || null,  // ✅ description
        fieldType,
        f.is_required ? 1 : 0,
        f.options_json ? JSON.stringify(f.options_json) : null,
        f.response_validation ? JSON.stringify(f.response_validation) : null, // ✅ validation
        f.order_no || 0,
      ]
    );

    created.push({
      field_id: result.insertId,
      slide_id,
      ...f,
      field_type: fieldType,
    });
  }
  return created;
};

// ✅ Get slides + fields (nested)
const getSlidesWithFields = async (form_id) => {
  const [slides] = await db.query(
    "SELECT * FROM tbl_form_slides WHERE form_id = ? ORDER BY order_no ASC, id ASC",
    [form_id]
  );

  const [fields] = await db.query(
    "SELECT * FROM tbl_form_fields WHERE form_id = ? ORDER BY slide_id ASC, order_no ASC, field_id ASC",
    [form_id]
  );

  const parsedFields = fields.map((f) => {
    let options = null;
    try {
      options = f.options ? JSON.parse(f.options) : null;
    } catch (e) {
      options = f.options;
    }

    let validation = null;
    try {
      validation = f.response_validation ? JSON.parse(f.response_validation) : null;
    } catch (e) {
      validation = f.response_validation;
    }

    return {
      ...f,
      options,
      description: f.description,   // ✅ include
      response_validation: validation, // ✅ parsed
      conditional_logic: (() => {
        try {
          return f.conditional_logic ? JSON.parse(f.conditional_logic) : null;
        } catch (e) {
          return f.conditional_logic;
        }
      })(),
    };
  });

  return slides.map((s) => ({
    ...s,
    fields: parsedFields.filter((f) => f.slide_id === s.id),
  }));
};

module.exports = {
  createSlide,
  addFieldsBulk,
  getSlidesWithFields,
};
