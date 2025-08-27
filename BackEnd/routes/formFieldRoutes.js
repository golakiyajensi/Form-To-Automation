const express = require("express");
const router = express.Router();
const formFieldController = require("../controllers/formFieldController");
const authMiddleware = require("../middlewares/authMiddleware");

// Role-based Access Example
router.post("/form/:formId/field", authMiddleware(["admin", "creator"]), formFieldController.createFormField);
router.get("/:formId", authMiddleware(["admin", "creator", "viewer"]), formFieldController.getFieldsByFormId);
router.get("/field/:id", authMiddleware(["admin", "creator", "viewer"]), formFieldController.getFieldById);
router.put("/:id", authMiddleware(["admin", "creator"]), formFieldController.updateFormField);
router.delete("/:id", authMiddleware(["admin"]), formFieldController.deleteFormField);

module.exports = router;
