const User = require("../Model/User");
const bcrypt = require("bcryptjs");
const { getUsers: getUsersPaginated } = require("../Services/userService");
const asyncHandler = require("../Utils/asyncHandler");

// ─── Create User ───────────────────────────────────────────────────────────────
exports.createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email, isDeleted: false });
  
  if (userExists)
    return res.status(400).json({ message: "User already exists" });


  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await User.create({ name, email, password: hashedPassword });
  console.log("🌈 user", user);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});

// ─── Get All Users (Pagination + Search) ──────────────────────────────────────
// Query params: ?page=1&limit=5&search=john
exports.getUsers = asyncHandler(async (req, res) => {
  const result = await getUsersPaginated(req.query);
  res.json(result);
  console.log(result);
});

// ─── Get Single User ───────────────────────────────────────────────────────────
exports.getUserById = asyncHandler(async (req, res) => {
  console.log(req);
  
  const user = await User.findOne({
    _id: req.params.id,
    isDeleted: false,
  }).select("-password");

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
});

// ─── Update User ───────────────────────────────────────────────────────────────
exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, isDeleted: false });

  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
  });
});

// ─── Soft Delete User ──────────────────────────────────────────────────────────
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, isDeleted: false });

  if (!user) return res.status(404).json({ message: "User not found" });

  user.isDeleted = true;
  user.deletedAt = new Date();
  await user.save();

  res.json({ message: "User deleted successfully" });
});

// ─── Restore Soft-Deleted User ─────────────────────────────────────────────────
exports.restoreUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, isDeleted: true });

  if (!user)
    return res.status(404).json({ message: "Deleted user not found" });

  user.isDeleted = false;
  user.deletedAt = null;
  await user.save();

  res.json({ message: "User restored successfully" });
});
