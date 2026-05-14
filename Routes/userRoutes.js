const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  restoreUser,
} = require("../Controllers/userController");

const protectAdmin = require("../Middleware/adminauthMiddleware");
const validate = require("../Middleware/validationMiddleware");

const { createUserSchema } = require("../Validations/authValidation");

const router = express.Router();

// All user routes are protected — admin only
router.post("/", protectAdmin, validate(createUserSchema), createUser);
console.log("🍩 createUser", createUser);
console.log("🍅 createUser", createUser);

router.get("/", protectAdmin, getUsers);
console.log("🍤 getUsers", getUsers);


router.get("userid/:id", protectAdmin, getUserById);
console.log("🤖 getUserById", getUserById);

router.put("/:id", protectAdmin, updateUser);
console.log("🥘 updateUser", updateUser);

router.delete("/:id", protectAdmin, deleteUser);
console.log("🦐 deleteUser", deleteUser);

router.patch("/:id/restore", protectAdmin, restoreUser);   // Restore soft-deleted user
console.log("💣 restoreUser", restoreUser);

module.exports = router;
