const express = require("express");
const router = express.Router();
const integrationController = require("../controllers/integrationController");
const authMiddleware = require("../middlewares/authMiddleware");

// Add integration
router.post("/forms/:id/integrations", authMiddleware(["admin","creator"]), integrationController.addIntegration);

// List integrations
router.get("/forms/:id/integrations", authMiddleware(["admin","creator","viewer"]), integrationController.getIntegrations);

// Delete integration
router.delete("/integrations/:id", authMiddleware(["admin","creator"]), integrationController.deleteIntegration);

module.exports = router;
