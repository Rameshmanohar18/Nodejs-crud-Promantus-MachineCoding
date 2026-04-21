// const express = require("express");
// const User = require("../Model/User");
// const protect = require("../Middleware/authMiddleware");

// const router = express.Router();

// // Create User
// // router.post("/", protect, async (req, res) => {
// //   const { name, email, role } = req.body;

// //   const user = await User.create({ name, email, role });

// //   res.stat us(201).json(user);
// // });

// router.post("/", protect, async (req, res) => {
//   try {
//     console.log("BODY:", req.body);
//     const { name, email, password, role } = req.body;

//     // check required fields
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "user",
//     });

//     res.status(201).json(user);
//   } catch (error) {
//     console.log("ERROR:", error);

//     res.status(400).json({ error: error.message });
//   }
// });

// // Get All Users
// router.get("/", protect, async (req, res) => {
//   const users = await User.find();
//   res.json(users);
// });

// // Get Single User
// router.get("/:id", protect, async (req, res) => {
//   const user = await User.findById(req.params.id);
//   res.json(user);
// });

// // Update User
// router.put("/:id", protect, async (req, res) => {
//   const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//   });

//   res.json(user);
// });

// // Delete User
// router.delete("/:id", protect, async (req, res) => {
//   await User.findByIdAndDelete(req.params.id);
//   res.json({ message: "User Deleted" });
// });

// module.exports = router;

const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../Controllers/userController");

const protect = require("../Middleware/adminauthMiddleware");

const router = express.Router();

// Admin creates user
router.post("/", protect, createUser);

// Admin gets users
router.get("/", protect, getUsers);

router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

module.exports = router;
