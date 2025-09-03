const express = require("express");
const router = express.Router();
const formController = require("../controllers/formController");
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");

// file upload config
const upload = multer({ dest: "uploads/" });

// Create Form (form-data support)
router.post(
  "/create",
  authMiddleware(["admin", "creator"]),
  upload.single("header_image"),
  formController.createForm
);

router.get(
  "/:id",
  authMiddleware(["admin", "creator"]),
  formController.getFormById
);

router.get(
  "/",
  authMiddleware(["admin", "creator"]),
  formController.getAllForms
);

router.put(
  "/:id",
  authMiddleware(["admin", "creator"]),
  upload.single("header_image"),
  formController.updateForm
);

router.delete(
  "/:id",
  authMiddleware(["admin"]),
  formController.deleteForm
);

// Public form fetch
router.get("/public/:id", authMiddleware(["admin", "viewer"]), formController.getFormForPublic);

module.exports = router;
