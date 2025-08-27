const express = require("express");
const router = express.Router();
const formStyleController = require("../controllers/formStyleController");
const authMiddleware = require("../middlewares/authMiddleware");

// Update / Save form style (admin or creator can update)
router.put(
  "/forms/:id/style",
  authMiddleware(["admin", "creator"]),
  formStyleController.updateFormStyle
);

// Get form style (any logged-in user can fetch)
router.get(
  "/forms/:id/style",
  authMiddleware(["admin", "creator", "viewer"]),
  formStyleController.getFormStyle
);

module.exports = router;
