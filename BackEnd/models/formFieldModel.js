const db = require("../config/db");

module.exports = {
  // Create Form Field
  createFormField: async (
    formId,
    slideId,
    label,
    labelFormatted,
    fieldType,
    isRequired,
    options,
    conditionalLogic,
    orderNo,
    fieldImage,
    description,
    responseValidation,
    createdBy // ✅ add this
  ) => {
    const [rows] = await db.query(
      "CALL sp_create_form_field(?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        formId,
        slideId,
        label,
        labelFormatted,
        fieldType,
        isRequired,
        JSON.stringify(options),
        JSON.stringify(conditionalLogic),
        orderNo,
        fieldImage,
        description,
        JSON.stringify(responseValidation),
        createdBy, // ✅ pass to SP
      ]
    );
    return rows[0][0];
  },

  // Get Fields by Form
  getFieldsByFormId: async (formId) => {
    const [rows] = await db.query(
      "SELECT * FROM tbl_form_fields WHERE form_id = ? ORDER BY order_no",
      [formId]
    );
    return rows;
  },

  // Get Single Field
  getFieldById: async (fieldId) => {
    const [rows] = await db.query(
      "SELECT * FROM tbl_form_fields WHERE field_id = ?",
      [fieldId]
    );
    return rows[0];
  },

  // Update Form Field
  updateFormField: async (
    fieldId,
    label,
    labelFormatted,
    fieldType,
    isRequired,
    options,
    conditionalLogic,
    orderNo,
    fieldImage,
    description, // ✅ new
    responseValidation // ✅ new
  ) => {
    await db.query("CALL sp_update_form_field(?,?,?,?,?,?,?,?,?,?,?,?)", [
      fieldId,
      label,
      labelFormatted,
      fieldType,
      isRequired,
      JSON.stringify(options),
      JSON.stringify(conditionalLogic),
      orderNo,
      fieldImage,
      description,
      JSON.stringify(responseValidation),
    ]);
  },

  // Delete Field
  deleteFormField: async (fieldId) => {
    const [result] = await db.query(
      "DELETE FROM tbl_form_fields WHERE field_id = ?",
      [fieldId]
    );
    return result.affectedRows;
  },
};
