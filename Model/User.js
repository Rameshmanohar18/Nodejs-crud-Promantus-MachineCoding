import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },   // Soft delete flag
    deletedAt: { type: Date, default: null },        // Timestamp of deletion
  },
  { timestamps: true },
);

// ─── Indexes for query performance ────────────────────────────────────────────
// Speeds up search by name (used in pagination filter)
userSchema.index({ name: 1 });
// Speeds up all queries that filter active users
userSchema.index({ isDeleted: 1 });
// Compound index: most queries filter by isDeleted + sort by createdAt
userSchema.index({ isDeleted: 1, createdAt: -1 });

export default mongoose.model("User", userSchema);
