const integrationModel = require("../models/integrationModel");
const response = require("../utils/responseTemplate");

exports.addIntegration = async (req, res) => {
  try {
    const { id: form_id } = req.params;
    const { type, config } = req.body;

    if (!type || !config)
      return res.status(400).json(response.error("Type and config are required"));

    const integration = await integrationModel.addIntegration(form_id, type, config);
    res.json(response.success("Integration added successfully", integration));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

exports.getIntegrations = async (req, res) => {
  try {
    const { id: form_id } = req.params;
    const integrations = await integrationModel.getIntegrations(form_id);
    res.json(response.success("Integrations fetched", integrations));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

exports.deleteIntegration = async (req, res) => {
  try {
    const { id: integration_id } = req.params;
    if (!integration_id) {
      return res.status(400).json(response.error("integration_id is required"));
    }

    const result = await integrationModel.deleteIntegration(integration_id);

    if (result.status === "not_found") {
      return res.status(404).json(response.error("Integration not found"));
    }

    res.json(response.success("Integration deleted"));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};
