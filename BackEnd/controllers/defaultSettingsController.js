const defaultModel = require('../models/defaultSettingsModel');
const response = require('../utils/responseTemplate');

// Form Defaults
exports.getFormDefaults = async (req, res) => {
  try {
    const data = await defaultModel.getFormDefaults();
    res.json(response.success("Form defaults fetched successfully", data));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

exports.updateFormDefaults = async (req, res) => {
  try {
    await defaultModel.updateFormDefaults(req.body);
    const data = await defaultModel.getFormDefaults();
    res.json(response.success("Form defaults updated successfully", data));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// Question Defaults
exports.getQuestionDefaults = async (req, res) => {
  try {
    const data = await defaultModel.getQuestionDefaults();
    res.json(response.success("Question defaults fetched successfully", data));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

exports.updateQuestionDefaults = async (req, res) => {
  try {
    await defaultModel.updateQuestionDefaults(req.body);
    const data = await defaultModel.getQuestionDefaults();
    res.json(response.success("Question defaults updated successfully", data));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};
