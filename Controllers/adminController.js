import Admin from "../Model/admin.js";
import RefreshToken from "../Model/RefreshToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../Services/authService.js";
import asyncHandler from "../Utils/asyncHandler.js";

// ─── Register Admin ────────────────────────────────────────────────────────────
export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const adminExists = await Admin.findOne({ email });
  if (adminExists)
    return res.status(400).json({ message: "Admin already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await Admin.create({
    name,
    email,
    password: hashedPassword,
    role: role || "Admin",
  });

  const accessToken = generateAccessToken(admin);
  const refreshToken = await generateRefreshToken(admin);

  res.status(201).json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    accessToken,
    refreshToken,
  });
});

// ─── Login Admin ───────────────────────────────────────────────────────────────
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(admin);
  const refreshToken = await generateRefreshToken(admin);

  res.json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    accessToken,
    refreshToken,
  });
});

// ─── Refresh Access Token ──────────────────────────────────────────────────────
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(400).json({ message: "Refresh token required" });

  const stored = await RefreshToken.findOne({ token: refreshToken });
  if (!stored)
    return res.status(403).json({ message: "Invalid refresh token" });

  if (stored.expiresAt < new Date()) {
    await RefreshToken.deleteOne({ token: refreshToken });
    return res.status(403).json({ message: "Refresh token expired" });
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  const admin = await Admin.findById(decoded.id);
  if (!admin)
    return res.status(403).json({ message: "Admin not found" });

  const newAccessToken = generateAccessToken(admin);

  res.json({ accessToken: newAccessToken });
});

// ─── Logout Admin ──────────────────────────────────────────────────────────────
export const logoutAdmin = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(400).json({ message: "Refresh token required" });

  await RefreshToken.deleteOne({ token: refreshToken });

  res.json({ message: "Logged out successfully" });
});
