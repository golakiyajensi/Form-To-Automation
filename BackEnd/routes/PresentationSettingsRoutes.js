const express = require("express");
const router = express.Router();
const controller = require("../controllers/PresentationSettingsController");
const authMiddleware = require("../middlewares/authMiddleware");

// Save / Update presentation settings
router.post(
  "/:formId",
  authMiddleware(["admin", "creator"]),
  controller.saveSettings
);

// Get presentation settings
router.get(
  "/:formId",
  authMiddleware(["admin", "creator", "viewer"]),
  controller.getSettings
);

module.exports = router;
