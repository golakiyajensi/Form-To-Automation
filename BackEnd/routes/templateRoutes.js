const express = require("express");
const router = express.Router();
const templateController = require("../controllers/templateController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", templateController.getTemplates);
router.post("/use/:templateId",authMiddleware(["admin","creator"]), templateController.useTemplate);

module.exports = router;
