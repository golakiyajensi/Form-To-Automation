const express = require("express");
const router = express.Router();
const formFieldController = require("../controllers/formFieldController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const parseRequestBody = require("../utils/parseRequestBody");

// Create Field
router.post(
  "/form/:formId/field",
  authMiddleware(["admin", "creator"]),
  upload.single("field_image"),
  parseRequestBody,
  formFieldController.createFormField
);

// Get all fields by formId
router.get(
  "/:formId",
  authMiddleware(["admin", "creator", "viewer"]),
  formFieldController.getFieldsByFormId
);

// Get single field
router.get(
  "/field/:id",
  authMiddleware(["admin", "creator", "viewer"]),
  formFieldController.getFieldById
);

// Update Field
router.put(
  "/:id",
  authMiddleware(["admin", "creator"]),
  upload.single("field_image"),
  parseRequestBody,
  formFieldController.updateFormField
);

// Delete Field
router.delete(
  "/:id",
  authMiddleware(["admin"]),
  formFieldController.deleteFormField
);

module.exports = router;
