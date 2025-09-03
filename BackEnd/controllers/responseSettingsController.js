const responseModel = require("../models/responseSettingsModel");
const response = require("../utils/responseTemplate");

exports.saveResponseSettings = async (req, res) => {
  try {
    const settings = req.body;
    await responseModel.saveResponseSettings(settings);
    res.json(response.success("Response settings saved successfully", settings));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

exports.getResponseSettings = async (req, res) => {
  try {
    const { form_id } = req.params;
    const settings = await responseModel.getResponseSettings(form_id);
    if (settings) {
      res.json(response.success("Response settings fetched", settings));
    } else {
      res.json(response.success("No settings found", {}));
    }
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};
