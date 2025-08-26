const express = require("express");
const router = express.Router();
const formController = require("../controllers/formController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/create",
  authMiddleware(["admin", "creator", "viewer"]),
  formController.createForm
);
router.get(
  "/:id",
  authMiddleware(["admin", "creator", "viewer"]),
  formController.getFormById
);
router.get(
  "/",
  authMiddleware(["admin", "creator", "viewer"]),
  formController.getAllForms
);
router.put(
  "/:id",
  authMiddleware(["admin", "creator"]),
  formController.updateForm
);
router.delete(
  "/:id",
  authMiddleware(["admin"]),
  formController.deleteForm
);

module.exports = router;
