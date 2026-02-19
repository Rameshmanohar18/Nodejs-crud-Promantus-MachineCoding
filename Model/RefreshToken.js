const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  token: String,
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  expiresAt: Date,
});

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
