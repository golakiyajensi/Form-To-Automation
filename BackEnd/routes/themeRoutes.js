const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const formThemeController = require("../controllers/formThemeController");

router.put("/form/:form_id/theme", authMiddleware(["admin","creator"]), upload.single("header_image"), formThemeController.updateFormTheme);
router.get("/form/:form_id/theme", authMiddleware(["admin","creator","viewer"]), formThemeController.getFormTheme);

module.exports = router;
