const presentationSettingsModel = require('../models/PresentationSettingsModel');
const response = require('../utils/responseTemplate');

exports.saveSettings = async (req, res) => {
  try {
    const { form_id, settings } = req.body;
    await presentationSettingsModel.savePresentationSettings(form_id, settings);

    // Save થયા પછી તરત જ settings fetch કરી લવીએ
    const updatedSettings = await presentationSettingsModel.getPresentationSettings(form_id);

    res.json(response.success("Form presentation settings saved successfully", updatedSettings));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

exports.getSettings = async (req, res) => {
  try {
    const { formId } = req.params;
    const settings = await presentationSettingsModel.getPresentationSettings(formId);
    if (!settings) {
      return res.json(response.success("No presentation settings found", {}));
    }
    res.json(response.success("Form presentation settings fetched", settings));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};