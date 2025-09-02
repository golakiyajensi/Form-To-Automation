const express = require("express");
const router = express.Router();
const controller = require("../controllers/defaultSettingsController");
const authMiddleware = require("../middlewares/authMiddleware");

// Form Defaults
router.get("/form-defaults", authMiddleware(["admin"]), controller.getFormDefaults);
router.put("/form-defaults", authMiddleware(["admin"]), controller.updateFormDefaults);

// Question Defaults
router.get("/question-defaults", authMiddleware(["admin"]), controller.getQuestionDefaults);
router.put("/question-defaults", authMiddleware(["admin"]), controller.updateQuestionDefaults);

module.exports = router;
