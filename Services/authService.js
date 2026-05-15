import jwt from "jsonwebtoken";
import RefreshToken from "../Model/RefreshToken.js";

export const generateAccessToken = (admin) => {
  return jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: "8d",
  });
};

export const generateRefreshToken = async (admin) => {
  const token = jwt.sign({ id: admin._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  await RefreshToken.create({
    token,
    admin: admin._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return token;
};

