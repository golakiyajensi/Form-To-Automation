const db = require("../config/db");

// ✅ Create Slide
const createSlide = async (
  form_id,
  title,
  description,
  order_no,
  title_formatted,
  description_formatted,
  created_by
) => {
  const [result] = await db.query(
    `INSERT INTO tbl_form_slides 
     (form_id, title, description, order_no, title_formatted, description_formatted, created_by) 
     VALUES (?,?,?,?,?,?,?)`,
    [
      form_id,
      title,
      description,
      order_no,
      title_formatted ? JSON.stringify(title_formatted) : null,
      description_formatted ? JSON.stringify(description_formatted) : null,
      created_by,
    ]
  );

  return {
    id: result.insertId,
    form_id,
    title,
    description,
    order_no,
    title_formatted,
    description_formatted,
    created_by,
  };
};

// ✅ Add fields in bulk (using SP)
const addFieldsBulk = async (slide_id, fields, userId) => {
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

  const [formRow] = await db.query(
    "SELECT form_id FROM tbl_form_slides WHERE id=?",
    [slide_id]
  );
  if (!formRow.length) throw new Error("Slide not found");
  const form_id = formRow[0].form_id;

  for (const f of fields) {
    const fieldType = fieldTypeMap[f.type];
    if (!fieldType) throw new Error(`Unsupported field type: ${f.type}`);

    const [rows] = await db.query(
      "CALL sp_create_form_field(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        form_id,
        slide_id,
        f.label,
        f.label_formatted ? JSON.stringify(f.label_formatted) : null,
        fieldType,
        f.is_required ? 1 : 0,
        f.options_json ? JSON.stringify(f.options_json) : null,
        f.conditional_logic ? JSON.stringify(f.conditional_logic) : null,
        f.order_no || 0,
        f.field_image || null,
        f.description || null,
        f.response_validation ? JSON.stringify(f.response_validation) : null,
        userId,
      ]
    );

    created.push(rows[0][0]);
  }
  return created;
};

// ✅ Get all slides safely
const getAllSlides = async () => {
  const [rows] = await db.query("CALL sp_get_all_slides()");

  return rows[0].map((slide) => {
    let titleFormatted = null;
    let descriptionFormatted = null;

    try {
      titleFormatted = slide.title_formatted ? JSON.parse(slide.title_formatted) : null;
    } catch (e) {
      titleFormatted = null;
    }

    try {
      descriptionFormatted = slide.description_formatted ? JSON.parse(slide.description_formatted) : null;
    } catch (e) {
      descriptionFormatted = null;
    }

    return {
      ...slide,
      title_formatted: titleFormatted,
      description_formatted: descriptionFormatted,
    };
  });
};

// ✅ Get slides + fields safely
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
    try { options = f.options ? JSON.parse(f.options) : null; } catch (e) { options = null; }

    let validation = null;
    try { validation = f.response_validation ? JSON.parse(f.response_validation) : null; } catch (e) { validation = null; }

    let conditional = null;
    try { conditional = f.conditional_logic ? JSON.parse(f.conditional_logic) : null; } catch (e) { conditional = null; }

    let labelFormatted = null;
    try { labelFormatted = f.label_formatted ? JSON.parse(f.label_formatted) : null; } catch (e) { labelFormatted = null; }

    return {
      ...f,
      options,
      response_validation: validation,
      conditional_logic: conditional,
      label_formatted: labelFormatted,
    };
  });

  const mappedSlides = slides.map((s) => {
    let titleFormatted = null;
    let descriptionFormatted = null;

    try { titleFormatted = s.title_formatted ? JSON.parse(s.title_formatted) : null; } catch(e){ titleFormatted = null; }
    try { descriptionFormatted = s.description_formatted ? JSON.parse(s.description_formatted) : null; } catch(e){ descriptionFormatted = null; }

    return {
      ...s,
      title_formatted: titleFormatted,
      description_formatted: descriptionFormatted,
      fields: parsedFields.filter((f) => f.slide_id === s.id),
    };
  });

  return mappedSlides;
};

// ✅ Update slide
const updateSlide = async (
  slide_id,
  title,
  description,
  order_no,
  title_formatted,
  description_formatted,
  header_image
) => {
  const [rows] = await db.query(
    "CALL sp_update_slide(?, ?, ?, ?, ?, ?, ?)",
    [
      slide_id,
      title,
      description,
      order_no,
      title_formatted ? JSON.stringify(title_formatted) : null,
      description_formatted ? JSON.stringify(description_formatted) : null,
      header_image || null
    ]
  );

  const slide = rows[0][0];
  let titleFormatted = null;
  let descriptionFormatted = null;

  try { titleFormatted = slide.title_formatted ? JSON.parse(slide.title_formatted) : null; } catch(e){ titleFormatted = null; }
  try { descriptionFormatted = slide.description_formatted ? JSON.parse(slide.description_formatted) : null; } catch(e){ descriptionFormatted = null; }

  return { ...slide, title_formatted: titleFormatted, description_formatted: descriptionFormatted };
};


// ✅ Delete slide
const deleteSlide = async (slide_id) => {
  const [rows] = await db.query("CALL sp_delete_slide(?)", [slide_id]);
  return rows[0][0].affected_rows > 0;
};

module.exports = {
  createSlide,
  addFieldsBulk,
  getAllSlides,
  getSlidesWithFields,
  updateSlide,
  deleteSlide,
};
