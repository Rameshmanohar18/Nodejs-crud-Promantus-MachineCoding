const express = require("express");
const router = express.Router();
const {
  adminRegister,
  adminLogin,
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../Controllers/userController");

const { protect, adminOnly } = require("../Middleware/authMiddleware");

router.post("/admin/register", adminRegister);
router.post("/admin/login", adminLogin);

router.post("/users", protect, adminOnly, createUser);
router.get("/users", protect, adminOnly, getUsers);
router.get("/users/:id", protect, adminOnly, getUserById);
router.put("/users/:id", protect, adminOnly, updateUser);
router.delete("/users/:id", protect, adminOnly, deleteUser);

module.exports = router;
