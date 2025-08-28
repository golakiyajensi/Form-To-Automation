const express = require("express");
const router = express.Router();
  const reportController = require("../controllers/reportController");
  const authMiddleware = require("../middlewares/authMiddleware");

// Create report (admin only)
router.post("/forms/:id/reports", authMiddleware(["admin"]), reportController.createReport);

// List all reports for a form
router.get("/forms/:id/reports", authMiddleware(["admin","viewer"]), reportController.getReportsByForm);

// Get single report
router.get("/reports/:id", authMiddleware(["admin","viewer"]), reportController.getReportById);

module.exports = router;
