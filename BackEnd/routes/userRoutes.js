const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// Only admin can manage users
router.get("/", authMiddleware(["admin"]), userController.listUsers);
router.put("/role", authMiddleware(["admin"]), userController.changeUserRole);
router.delete("/:user_id", authMiddleware(["admin"]), userController.removeUser);

module.exports = router;
