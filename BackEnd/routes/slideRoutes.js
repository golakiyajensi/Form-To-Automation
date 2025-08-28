const express = require("express");
const router = express.Router();
const slideController = require("../controllers/slideController");
const authMiddleware = require("../middlewares/authMiddleware");

// Create Slide with 5 fields
router.post("/slides", authMiddleware(["admin","creator"]), slideController.createSlide);

module.exports = router;
