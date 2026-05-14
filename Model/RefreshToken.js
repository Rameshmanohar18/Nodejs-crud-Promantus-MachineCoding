import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  token: String,
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  expiresAt: Date,
});

export default mongoose.model("RefreshToken", refreshTokenSchema);
