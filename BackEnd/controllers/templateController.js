const Template = require("../models/templateModel");

exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.getAll();
    res.json(templates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.useTemplate = async (req, res) => {
  const { templateId } = req.params;
  const userId = req.user.id; // from auth middleware
  try {
    const result = await Template.useTemplate(templateId, userId);
    res.json({ formId: result.formId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get template fields by templateId
exports.getTemplateFields = async (req, res) => {
  const { templateId } = req.params;
  try {
    const fields = await Template.getFields(templateId);
    res.json(fields);
  } catch (err) {
    console.error("❌ Error fetching fields:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTemplateById = async (req, res) => {
  const { templateId } = req.params;
  try {
    const template = await Template.getById(templateId);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.json(template);
  } catch (err) {
    console.error("❌ Error fetching template:", err);
    res.status(500).json({ message: "Server error" });
  }
};