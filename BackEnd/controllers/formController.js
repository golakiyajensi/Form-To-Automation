const formModel = require("../models/formModel");
const formThemeModel = require("../models/formThemeModel");
const response = require("../utils/responseTemplate");

// Create Form
exports.createForm = async (req, res) => {
  try {
    const { title, description, title_formatted, description_formatted } =
      req.body;
    const created_by = req.user.userId;
    const header_image = req.file
      ? req.file.filename
      : req.body.header_image || null;

    const result = await formModel.createForm(
      title,
      description,
      created_by,
      header_image,
      title_formatted,
      description_formatted
    );

    res.json(
      response.success("Form created successfully", {
        id: result.form_id,
        title,
        description,
        title_formatted,
        description_formatted,
        created_by,
        header_image,
        share_url: result.share_url,
      })
    );
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// Get Form by ID
exports.getFormById = async (req, res) => {
  try {
    const formId = req.params.id;
    const result = await formModel.getFormById(formId);

    if (!result)
      return res.status(404).json(response.notFound("Form not found"));

    const responseData = {
      id: result.form_id,
      title: result.title,
      description: result.description,
      created_by: result.created_by,
      header_image: result.header_image,
    };

    res.json(response.success("Form fetched successfully", responseData));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// Get All Forms
exports.getAllForms = async (req, res) => {
  try {
    const result = await formModel.getAllForms();

    const responseData = result.map((form) => ({
      id: form.form_id,
      title: form.title,
      description: form.description,
      created_by: form.created_by,
      header_image: form.header_image,
    }));

    res.json(response.success("Forms fetched successfully", responseData));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// Update Form
// Update Form
exports.updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, title_formatted, description_formatted } = req.body;

    const currentForm = await formModel.getFormById(id);
    if (!currentForm) return res.status(404).json(response.error("Form not found"));

    // Optional: check if logged-in user is creator/admin
    if (req.user.role !== "admin" && req.user.id !== currentForm.created_by) {
      return res.status(403).json(response.error("Not authorized to update this form"));
    }

    const updatedTitle = title ?? currentForm.title;
    const updatedDescription = description ?? currentForm.description;
    const updatedTitleFormatted = title_formatted ?? currentForm.title_formatted;
    const updatedDescriptionFormatted = description_formatted ?? currentForm.description_formatted;
    const updatedHeaderImage = req.file ? req.file.filename : currentForm.header_image;

    await formModel.updateForm(
      id,
      updatedTitle,
      updatedDescription,
      updatedTitleFormatted,
      updatedDescriptionFormatted,
      updatedHeaderImage
    );

    const updatedForm = await formModel.getFormById(id);

    const responseData = {
      id: updatedForm.form_id,
      title: updatedForm.title,
      description: updatedForm.description,
      title_formatted: updatedForm.title_formatted,
      description_formatted: updatedForm.description_formatted,
      created_by: updatedForm.created_by,
      header_image: updatedForm.header_image
    };

    res.json(response.success("Form updated successfully", responseData));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// Delete Form
exports.deleteForm = async (req, res) => {
  try {
    const { id } = req.params;

    const currentForm = await formModel.getFormById(id);
    if (!currentForm)
      return res.status(404).json(response.error("Form not found"));

    // Only admin or creator can delete
    if (req.user.role !== "admin" && req.user.id !== currentForm.created_by) {
      return res
        .status(403)
        .json(response.error("Not authorized to delete this form"));
    }

    const message = await formModel.deleteForm(id);
    res.json(response.success(message));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// Public Form
exports.getFormForPublic = async (req, res) => {
  try {
    const formId = req.params.id;

    // Form fetch karo
    const result = await formModel.getFormById(formId);
    if (!result)
      return res.status(404).json(response.notFound("Form not found"));

    // Slides + fields fetch karo
    const slides = await formModel.getSlidesWithFields(formId);

    // Theme fetch karo → auto-create default if missing
    const theme = await formThemeModel.getFormTheme(formId);

    // Response
    res.json(
      response.success("Public form fetched successfully", {
        form: result,
        theme: theme,
        slides: slides,
      })
    );
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};
