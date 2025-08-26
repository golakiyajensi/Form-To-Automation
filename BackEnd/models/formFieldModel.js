const db = require('../config/db');

module.exports = {
    // Create Form Field
    createFormField: async (formId, label, fieldType, isRequired, options, conditionalLogic, orderNo) => {
        const [rows] = await db.query(
            "CALL sp_create_form_field(?,?,?,?,?,?,?)",
            [formId, label, fieldType, isRequired, JSON.stringify(options), JSON.stringify(conditionalLogic), orderNo]
        );
        return rows[0][0]; // returns { field_id: X }
    },

    // Get Fields by Form
    getFieldsByFormId: async (formId) => {
        const [rows] = await db.query("SELECT * FROM tbl_form_fields WHERE form_id = ?", [formId]);
        return rows;
    },

    // Get Single Field
    getFieldById: async (fieldId) => {
        const [rows] = await db.query("SELECT * FROM tbl_form_fields WHERE field_id = ?", [fieldId]);
        return rows[0];
    },

    // Update Form Field
    updateFormField: async (fieldId, label, fieldType, isRequired, options, conditionalLogic, orderNo) => {
        await db.query(
            "CALL sp_update_form_field(?,?,?,?,?,?,?)",
            [fieldId, label, fieldType, isRequired, JSON.stringify(options), JSON.stringify(conditionalLogic), orderNo]
        );
    },

    // Delete Field
    deleteFormField: async (fieldId) => {
        await db.query("DELETE FROM tbl_form_fields WHERE field_id = ?", [fieldId]);
    }
};
