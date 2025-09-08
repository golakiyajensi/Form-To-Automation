const express = require("express");
const router = express.Router();
const slideController = require("../controllers/slideController");
const authMiddleware = require("../middlewares/authMiddleware");
const { upload, changeSlideUpload } = require("../middlewares/uploadMiddleware");

// Create slide
router.post("/forms/:form_id/slides", authMiddleware(["admin","creator"]), slideController.createSlide);

// Bulk fields add
router.post("/slides/:slide_id/fields/bulk", authMiddleware(["admin","creator"]), slideController.addFieldsBulk);

// Get all slides from all forms
router.get("/slides", authMiddleware(["admin","creator"]), slideController.getAllSlides);

// Get slides with fields
router.get("/forms/:form_id/slides", authMiddleware(["admin","creator","viewer"]), slideController.getSlidesWithFields);

// Edit slide
router.put("/slides/:slide_id", changeSlideUpload.single("header_image"), authMiddleware(["admin","creator"]), slideController.editSlide);

// Delete slide
router.delete("/slides/:slide_id", authMiddleware(["admin","creator"]), slideController.deleteSlide);

module.exports = router;
