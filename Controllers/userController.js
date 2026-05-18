import User from "../Model/User.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { getUsers as getUsersPaginated } from "../Services/userService.js";
import asyncHandler from "../Utils/asyncHandler.js";

// ─── Create User ───────────────────────────────────────────────────────────────
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email, isDeleted: false });
  
  if (userExists)
    return res.status(400).json({ message: "User already exists" });


  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await User.create({ name, email, password: hashedPassword });
  console.log("🌈 CreateUser", user);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});

// ─── Get All Users (Pagination + Search) ──────────────────────────────────────
// Query params: ?page=1&limit=5&search=john
export const getUsers = asyncHandler(async (req, res) => {
  const result = await getUsersPaginated(req.query);
  console.log("🍟 GetUsers is:-", result);

  res.json(result);
  console.log(result);
});

// ─── Get Single User ───────────────────────────────────────────────────────────
export const getUserById = asyncHandler(async (req, res) => {
  // console.log("🔥 Controller hit for the getUserById:", req.params.id);

  const { id } = req.params;
  console.log("🍄 id", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  const user = await User.findOne({
    _id: id,
    isDeleted: false,
  }).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.status(200).json(user);
});

console.log("🥑 getUserById", getUserById);

// ─── Update User ───────────────────────────────────────────────────────────────
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, isDeleted: false });

  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  const updatedUser = await user.save();
  console.log("🐷 updatedUser", updatedUser);

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
  });
});

// ─── Soft Delete User ──────────────────────────────────────────────────────────
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, isDeleted: false });

  if (!user) return res.status(404).json({ message: "User not found" });

  user.isDeleted = true;
  user.deletedAt = new Date();
  await user.save();

  res.json({ message: "User deleted successfully" });
  console.log("🌈  res.json",  res.json);

});

// ─── Restore Soft-Deleted User ─────────────────────────────────────────────────
export const restoreUser = asyncHandler(async (req, res) => {     
  const user = await User.findOne({ _id: req.params.id, isDeleted: true });

  if (!user)
    return res.status(404).json({ message: "Deleted user not found" });

  user.isDeleted = false;
  user.deletedAt = null;
  await user.save();

  res.json({ message: "User restored successfully" });
});
 

// Complete CRUD operations in the ExpressJs, Nodejs and mongoDB