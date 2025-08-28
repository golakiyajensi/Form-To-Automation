const db = require("../config/db");

const addIntegration = async (form_id, type, config) => {
  const [rows] = await db.query(
    "CALL sp_add_integration(?,?,?)",
    [form_id, type, JSON.stringify(config)]
  );
  return rows[0][0];
};

const getIntegrations = async (form_id) => {
  const [rows] = await db.query("CALL sp_get_integrations(?)", [form_id]);
  return rows[0];
};

const deleteIntegration = async (integration_id) => {
  const [rows] = await db.query("CALL sp_delete_integration(?)", [integration_id]);
  return rows[0][0];
};

module.exports = { addIntegration, getIntegrations, deleteIntegration };
