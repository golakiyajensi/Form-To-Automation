const express = require("express");
const router = express.Router();
const responseController = require("../controllers/responseController");
const authMiddleware = require("../middlewares/authMiddleware");

// Submit new response
router.post("/", authMiddleware(["admin", "viewer"]), responseController.submitResponse);

// Get all responses (admin only)
router.get("/all", authMiddleware(["admin"]), responseController.getAllResponses);

// Get all responses for a form
router.get("/:formId", authMiddleware(["admin"]), responseController.getResponsesByForm);

// GET Excel-compatible data
router.get("/excel/:id", authMiddleware(["admin"]), responseController.getResponseForExcel);

module.exports = router;
