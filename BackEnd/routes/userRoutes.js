const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// Only admin can manage users
router.get("/", authMiddleware(["admin","creator"]), userController.listUsers);
// user_id URL params ma pass thase
router.put("/role/:user_id", authMiddleware(["admin"]), userController.changeUserRole);
router.delete("/:user_id", authMiddleware(["admin"]), userController.removeUser);

module.exports = router;
