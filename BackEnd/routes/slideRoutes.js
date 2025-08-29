const express = require("express");
const router = express.Router();
const slideController = require("../controllers/slideController");
const authMiddleware = require("../middlewares/authMiddleware");

// Create slide
router.post("/forms/:form_id/slides", authMiddleware(["admin","creator"]), slideController.createSlide);

// Bulk fields add
router.post("/slides/:slide_id/fields/bulk", authMiddleware(["admin","creator"]), slideController.addFieldsBulk);

// Get slides with fields
router.get("/forms/:form_id/slides", authMiddleware(["admin","creator","viewer"]), slideController.getSlidesWithFields);

module.exports = router;
