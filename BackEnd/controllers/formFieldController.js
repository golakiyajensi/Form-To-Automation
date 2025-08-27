const formFieldModel = require("../models/formFieldModel");
const response = require("../utils/responseTemplate");

// Create Form Field
exports.createFormField = async (req, res) => {
  try {
    const {
      form_id,
      label,
      field_type,
      is_required,
      options,
      conditional_logic,
      order_no,
    } = req.body;
    const result = await formFieldModel.createFormField(
      form_id,
      label,
      field_type,
      is_required,
      options,
      conditional_logic,
      order_no
    );

    const responseData = {
      id: result.field_id,
      form_id,
      label,
      field_type,
      is_required,
      options,
      conditional_logic,
      order_no,
    };

    res.json(response.success("Field created successfully", responseData));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// Get Fields by Form
exports.getFieldsByFormId = async (req, res) => {
  try {
    const formId = req.params.formId;
    const result = await formFieldModel.getFieldsByFormId(formId);
    const responseData = result.map((field) => ({
      id: field.field_id,
      form_id: field.form_id,
      label: field.label,
      field_type: field.field_type,
      is_required: field.is_required === 1,
      options: field.options,
      conditional_logic: field.conditional_logic,
      order_no: field.order_no,
    }));
    res.json(response.success("Fields fetched successfully", responseData));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// Get Single Field
exports.getFieldById = async (req, res) => {
  try {
    const fieldId = req.params.id;
    const result = await formFieldModel.getFieldById(fieldId);

    if (!result) {
      return res.status(404).json(response.notFound("Field not found"));
    }
    const fieldsToProcess = Array.isArray(result) ? result : [result];

    const responseData = fieldsToProcess.map((field) => ({
      id: field.field_id,
      form_id: field.form_id,
      label: field.label,
      field_type: field.field_type,
      is_required: field.is_required === 1,
      options: field.options,
      conditional_logic: field.conditional_logic,
      order_no: field.order_no,
    }));

    res.json(response.success("Field fetched successfully", responseData));
  } catch (err) {
    console.error("Error in getFieldById:", err);
    res.status(500).json(response.error(err.message));
  }
};

// Update Form Field
exports.updateFormField = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    // Old record fetch
    const existingField = await formFieldModel.getFieldById(id);
    if (!existingField) {
      return res.status(404).json(response.notFound("Field not found"));
    }

    // Merge new values with old
    const updatedField = {
      label: body.label ?? existingField.label,
      field_type: body.field_type ?? existingField.field_type,
      is_required: body.is_required ?? existingField.is_required,
      options: body.options ?? existingField.options,
      conditional_logic: body.conditional_logic ?? existingField.conditional_logic,
      order_no: body.order_no ?? existingField.order_no,
    };

    // Call update
    await formFieldModel.updateFormField(
      id,
      updatedField.label,
      updatedField.field_type,
      updatedField.is_required,
      updatedField.options,
      updatedField.conditional_logic,
      updatedField.order_no
    );

    res.json(response.success("Field updated successfully", updatedField));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// Delete Form Field
exports.deleteFormField = async (req, res) => {
  try {
    const { id } = req.params;
    await formFieldModel.deleteFormField(id);
    res.json(response.success("Field deleted successfully"));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};
