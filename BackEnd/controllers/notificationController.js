const notificationModel = require("../models/notificationModel");
const response = require("../utils/responseTemplate");

// Get user notification settings
exports.getNotificationSettings = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const settings = await notificationModel.getNotificationSettings(user_id);

    if (!settings) {
      return res.json(response.success("No notification settings found", {}));
    }

    res.json(response.success("Notification settings fetched", settings));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};

// Update user notification settings
exports.updateNotificationSettings = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const updated = await notificationModel.updateSettings(user_id, req.body);
    res.json(response.success("Notification settings updated", updated));
  } catch (err) {
    res.status(500).json(response.error(err.message));
  }
};
