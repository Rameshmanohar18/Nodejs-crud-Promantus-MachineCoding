const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../Model/admin");
const RefreshToken = require("../Model/RefreshToken");

const generateAccessToken = (admin) => {
  return jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = async (admin) => {
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

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
