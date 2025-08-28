const formModel = require("../models/formModel");
const response = require("../utils/responseTemplate");

exports.createForm = async (req, res) => {
  try {
    const { title, description, created_by } = req.body;
    const result = await formModel.createForm(title, description, created_by);
    const responseData = {
      id: result.form_id,
      title,
      description,
      created_by,
    };
    res.json(response.success("Form created successfully", responseData));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

exports.getFormById = async (req, res) => {
  try {
    const formId = req.params.id;
    const result = await formModel.getFormById(formId);

    if (!result) {
      return res.status(404).json(response.notFound("Form not found"));
    }

    const responseData = {
      id: result.form_id,
      title: result.title,
      description: result.description,
      created_by: result.created_by,
    };

    res.json(response.success("Form fetched successfully", responseData));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

exports.getAllForms = async (req, res) => {
  try {
    const result = await formModel.getAllForms();

    const responseData = result.map((form) => ({
      id: form.form_id,
      title: form.title,
      description: form.description,
      created_by: form.created_by,
    }));

    res.json(response.success("Forms fetched successfully", responseData));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

exports.updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Get current form data
    const currentForm = await formModel.getFormById(id);
    if (!currentForm) {
      return res.status(404).json(response.error("Form not found"));
    }

    // Use new value if provided, otherwise keep old value
    const updatedTitle = title !== undefined ? title : currentForm.title;
    const updatedDescription = description !== undefined ? description : currentForm.description;

    // Update form
    await formModel.updateForm(id, updatedTitle, updatedDescription);

    // Get updated form
    const updatedForm = await formModel.getFormById(id);

    const responseData = {
      id: updatedForm.form_id,
      title: updatedForm.title,
      description: updatedForm.description,
      created_by: updatedForm.created_by,
    };
    res.json(response.success("Form updated successfully", responseData));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

exports.deleteForm = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await formModel.deleteForm(id);
    res.json(response.success(message));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};
