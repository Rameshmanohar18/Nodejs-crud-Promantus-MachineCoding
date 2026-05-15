import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  restoreUser,
} from "../Controllers/userController.js";

import protectAdmin from "../Middleware/adminauthMiddleware.js";
import validate from "../Middleware/validationMiddleware.js";
import { createUserSchema } from "../Validations/authValidation.js";

const router = express.Router();

// Create user (Admin)
router.post(
  "/",
  protectAdmin,
  validate(createUserSchema),
  createUser
);

// Get all users (Admin)
router.get("/", protectAdmin, getUsers);

// Get single user by ID
router.get("/:id", protectAdmin, getUserById);

// Update user
router.put("/:id", protectAdmin, updateUser);

// Soft delete
router.delete("/:id", protectAdmin, deleteUser);

// Restore user
router.patch("/:id/restore", protectAdmin, restoreUser);

export default router;
