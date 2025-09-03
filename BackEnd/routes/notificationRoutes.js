const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middlewares/authMiddleware");

// Any logged-in user can manage own notification settings
router.get("/settings", authMiddleware(["admin","creator","viewer"]), notificationController.getNotificationSettings);
router.put("/settings", authMiddleware(["admin","creator","viewer"]), notificationController.updateNotificationSettings);

module.exports = router;
