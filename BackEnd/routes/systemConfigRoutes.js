const express = require("express");
const router = express.Router();
const systemConfigController = require("../controllers/systemConfigController");
const authMiddleware = require("../middlewares/authMiddleware");

// Only admin can manage system config
router.get("/config", authMiddleware(["admin"]), systemConfigController.getConfig);
router.put("/config", authMiddleware(["admin"]), systemConfigController.updateConfig);

module.exports = router;
