// const express = require("express");
// const router = express.Router();
// const {
//   adminRegister,
//   adminLogin,
//   createUser,
//   getUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
// } = require("../Controllers/userController");

// const { protect, adminOnly } = require("../Middleware/authMiddleware");

// router.post("/admin/register", adminRegister);
// router.post("/admin/login", adminLogin);

// router.post("/users", protect, adminOnly, createUser);
// router.get("/users", protect, adminOnly, getUsers);
// router.get("/users/:id", protect, adminOnly, getUserById);
// router.put("/users/:id", protect, adminOnly, updateUser);
// router.delete("/users/:id", protect, adminOnly, deleteUser);

// module.exports = router;

const express = require("express");
const User = require("../Model/User");
const protect = require("../Middleware/authMiddleware");

const router = express.Router();

// Create User
router.post("/", protect, async (req, res) => {
  const { name, email, role } = req.body;

  const user = await User.create({ name, email, role });

  res.status(201).json(user);
});
   
// Get All Users
router.get("/", protect, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get Single User
router.get("/:id", protect, async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// Update User
router.put("/:id", protect, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(user);
});

// Delete User
router.delete("/:id", protect, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User Deleted" });
});

module.exports = router;
