const permissionModel = require("../models/permissionModel");
const response = require("../utils/responseTemplate");

// Share form
exports.shareForm = async (req, res) => {
  try {
    const { id: form_id } = req.params;
    const { user_id, permission } = req.body;

    if (!user_id || !permission)
      return res.status(400).json(response.error("user_id and permission required"));

    const data = await permissionModel.shareForm(form_id, user_id, permission);
    res.json(response.success("Form shared successfully", data));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// List users
exports.listFormUsers = async (req, res) => {
  try {
    const { id: form_id } = req.params;
    const users = await permissionModel.getFormUsers(form_id);
    res.json(response.success("Form users fetched", users));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// Update permission
exports.updatePermission = async (req, res) => {
  try {
    const { id: permission_id } = req.params;
    const { permission } = req.body;

    if (!permission)
      return res.status(400).json(response.error("Permission is required"));

    const updated = await permissionModel.updatePermission(permission_id, permission);
    res.json(response.success("Permission updated", updated));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// Delete permission
exports.removePermission = async (req, res) => {
  try {
    const { id: permission_id } = req.params;
    if (!permission_id) {
      return res.status(400).json(response.error("permission_id is required"));
    }

    const result = await permissionModel.deletePermission(permission_id);

    if (result.status === "not_found") {
      return res.status(404).json(response.error("Permission not found"));
    }

    res.json(response.success("Permission removed"));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

