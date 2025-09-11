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
