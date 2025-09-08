const formFieldModel = require("../models/formFieldModel");
const response = require("../utils/responseTemplate");

// Create field
// Create field
exports.createFormField = async (req, res) => {
  try {
    const {
      slide_id,
      label,
      label_formatted,
      field_type,
      is_required,
      options,
      conditional_logic,
      order_no,
      description,
      response_validation,
    } = req.parsedBody;

    const fieldImage = req.parsedBody.field_image || null;

    // ✅ Logic: slide_id hoy to form_id null, else form_id use
    const formId = slide_id ? null : req.params.formId;

    const result = await formFieldModel.createFormField(
      formId,
      slide_id,
      label,
      label_formatted,
      field_type,
      is_required,
      options,
      conditional_logic,
      order_no,
      fieldImage,
      description,
      response_validation,
      req.user.user_id
    );

    res.json(response.success("Field created successfully", result));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};


// Get fields by formId
exports.getFieldsByFormId = async (req, res) => {
  try {
    const rows = await formFieldModel.getFieldsByFormId(req.params.formId);
    res.json(response.success("Fields fetched", rows));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// Get single field
exports.getFieldById = async (req, res) => {
  try {
    const row = await formFieldModel.getFieldById(req.params.id);
    if (!row) return res.status(404).json(response.error("Field not found"));
    res.json(response.success("Field fetched", row));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// Update field (fetch old + merge)
exports.updateFormField = async (req, res) => {
  try {
    const fieldId = req.params.id;

    const oldField = await formFieldModel.getFieldById(fieldId);
    if (!oldField)
      return res.status(404).json(response.error("Field not found"));

    const body = req.parsedBody;

    const updated = {
      ...oldField,
      ...body,
      field_image: req.file ? req.file.filename : oldField.field_image,
    };

    await formFieldModel.updateFormField(
      fieldId,
      updated.label,
      updated.label_formatted,
      updated.field_type,
      updated.is_required,
      updated.options,
      updated.conditional_logic,
      updated.order_no,
      updated.field_image,
      updated.description,          // ✅ new
      updated.response_validation   // ✅ new
    );

    const newField = await formFieldModel.getFieldById(fieldId);
    res.json(response.success("Field updated successfully", newField));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// Delete field
exports.deleteFormField = async (req, res) => {
  try {
    const deleted = await formFieldModel.deleteFormField(req.params.id);
    if (deleted === 0)
      return res.status(404).json(response.error("Field not found"));
    res.json(response.success("Field deleted successfully"));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};
