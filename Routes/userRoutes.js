const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../Controllers/userController");
const protectAdmin = require("../Middleware/adminauthMiddleware");
const validate = require("../Middleware/validationMiddleware");
const { createUserSchema } = require("../Validations/authValidation");

const router = express.Router();

// All user routes are protected — admin only
router.post("/", protectAdmin, validate(createUserSchema), createUser);
router.get("/", protectAdmin, getUsers);
router.get("/:id", protectAdmin, getUserById);
router.put("/:id", protectAdmin, updateUser);
router.delete("/:id", protectAdmin, deleteUser);

module.exports = router;
