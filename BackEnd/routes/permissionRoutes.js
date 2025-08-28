const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permissionController");
const authMiddleware = require("../middlewares/authMiddleware");

// Share form
router.post("/forms/:id/share", authMiddleware(["admin","creator"]), permissionController.shareForm);

// List form users
router.get("/forms/:id/users", authMiddleware(["admin","creator"]), permissionController.listFormUsers);

// Update permission
router.put("/permissions/:id", authMiddleware(["admin","creator"]), permissionController.updatePermission);

// Delete permission
router.delete("/permissions/:id", authMiddleware(["admin","creator"]), permissionController.removePermission);

module.exports = router;
