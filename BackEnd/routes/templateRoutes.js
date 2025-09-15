const express = require("express");
const router = express.Router();
const templateController = require("../controllers/templateController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", templateController.getTemplates);
router.post("/use/:templateId",authMiddleware(["admin","creator"]), templateController.useTemplate);
// ✅ new route
router.get("/:templateId/fields", authMiddleware(["admin","creator"]), templateController.getTemplateFields);

router.get("/:templateId", authMiddleware(["admin","creator"]), templateController.getTemplateById);

module.exports = router;
