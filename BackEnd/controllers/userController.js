const userModel = require("../models/userModel");
const response = require("../utils/responseTemplate");

exports.listUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.json(response.success("Users fetched successfully", users));
    } catch (err) {
        res.status(500).json(response.error(err.message));
    }
};

exports.changeUserRole = async (req, res) => {
  try {
    const { user_id } = req.params;   // params mathi user_id lidhu
    const { role } = req.body;        // body mathi role lidhu

    if (!user_id || !role) {
      return res.status(400).json(response.error("user_id and role are required"));
    }

    const updatedUser = await userModel.updateUserRole(user_id, role);

    if (!updatedUser) {
      return res.status(404).json(response.error("User not found"));
    }

    res.json(response.success("User role updated successfully", updatedUser));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};


exports.removeUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      return res.status(400).json(response.error("user_id is required"));
    }

    const result = await userModel.deleteUser(user_id);

    if (result.status === "not_found") {
      return res.status(404).json(response.error("User not found"));
    }

    res.json(response.success("User deleted successfully"));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};
