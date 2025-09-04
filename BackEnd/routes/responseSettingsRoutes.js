const express = require("express");
const router = express.Router();
const controller = require("../controllers/responseSettingsController");
const authMiddleware = require("../middlewares/authMiddleware");

// Save or update settings
router.post(
  "/save",
  authMiddleware(["admin", "creator"]),
  controller.saveResponseSettings
);

// Get settings by form_id
router.get(
  "/:form_id",
  authMiddleware(["admin", "creator", "viewer"]),
  controller.getResponseSettings
);

module.exports = router;
