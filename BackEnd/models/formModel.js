const db = require("../config/db");

module.exports = {
  createForm: async (
    title,
    description,
    createdBy,
    headerImage,
    titleFormatted,
    descriptionFormatted
  ) => {
    const [rows] = await db.query("CALL sp_create_form(?, ?, ?, ?, ?, ?)", [
      title,
      description,
      createdBy,
      headerImage,
      titleFormatted,
      descriptionFormatted,
    ]);
    return rows[0][0];
  },

  getFormById: async (formId) => {
    const [rows] = await db.query("CALL sp_get_form_by_id(?)", [formId]);
    return rows[0][0];
  },

  getAllForms: async () => {
    const [rows] = await db.query("CALL sp_get_all_forms()");
    return rows[0];
  },

  updateForm: async (
    formId,
    title,
    description,
    headerImage,
    titleFormatted,
    descriptionFormatted
  ) => {
    await db.query("CALL sp_update_form(?, ?, ?, ?, ?, ?)", [
      formId,
      title,
      description,
      headerImage,
      titleFormatted,
      descriptionFormatted,
    ]);
    return true;
  },

  deleteForm: async (formId) => {
    await db.query("CALL sp_delete_form(?, @p_status)", [formId]);
    const [[{ p_status }]] = await db.query("SELECT @p_status AS p_status");
    return p_status;
  },

  getSlidesWithFields: async (formId) => {
    const [rows] = await db.query("CALL sp_get_slides_with_fields(?)", [
      formId,
    ]);

    const slides = rows[0]; // slides
    const fields = rows[1]; // fields

    // slides + fields merge
    const slidesWithFields = slides.map((slide) => {
      return {
        ...slide,
        fields: fields.filter((f) => f.slide_id === slide.slide_id),
      };
    });

    return slidesWithFields;
  },
};
