const systemConfigModel = require("../models/systemConfigModel");
const response = require("../utils/responseTemplate");

// Get system config
exports.getConfig = async (req, res) => {
  try {
    const config = await systemConfigModel.getSystemConfig();
    res.json(response.success("System config fetched", config));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// Update system config
exports.updateConfig = async (req, res) => {
  try {
    const updated = await systemConfigModel.updateSystemConfig(req.body);
    res.json(response.success("System config updated", updated));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};
