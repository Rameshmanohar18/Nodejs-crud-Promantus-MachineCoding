const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Admin Register
exports.adminRegister = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "Admin already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin",
  });

  res.status(201).json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    token: generateToken(admin._id),
  });
};

// Admin Login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await User.findOne({ email });

  if (admin && admin.role === "admin" && (await bcrypt.compare(password, admin.password))) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

// Create User (Admin only)
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "user",
  });

  res.status(201).json(user);
};

// Get All Users
exports.getUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.json(users);
};

// Get Single User
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
};

// Update User
exports.updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  const updatedUser = await user.save();
  res.json(updatedUser);
};

// Delete User
exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  await user.deleteOne();
  res.json({ message: "User deleted successfully" });
};
