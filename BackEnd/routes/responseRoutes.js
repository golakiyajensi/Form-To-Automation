const express = require("express");
const router = express.Router();
const responseController = require("../controllers/responseController");
const authMiddleware = require("../middlewares/authMiddleware");

// Submit new response
router.post("/:formId", authMiddleware(["admin", "viewer", "creator"]), responseController.submitResponse);

// Get all responses (admin only)
router.get("/all", authMiddleware(["admin","creator"]), responseController.getAllResponses);

// Get all responses for a form
router.get("/:formId", authMiddleware(["admin","creator"]), responseController.getResponsesByForm);

// ✅ Get single response by responseId
router.get("/response/:responseId", authMiddleware(["admin","creator"]), responseController.getResponseById);

// Export CSV
router.get("/export/csv/:formId", authMiddleware(["admin","creator"]), responseController.exportResponsesCSV);

// Export PDF
router.get("/export/pdf/:formId", authMiddleware(["admin","creator"]), responseController.exportResponsesPDF);

module.exports = router;
