// const mongoose = require("mongoose");

// const adminSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     role: {
//       type: String,
//       enum: ["SuperAdmin", "Admin"],
//       default: "Admin",
//     },
//   },
//   { timestamps: true },
// );
   
// module.exports = mongoose.model("Admin", adminSchema);

const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Admin", "SuperAdmin"],
      default: "Admin",
    },
  },
  { timestamps: true },
);

// ─── Index for login query performance ────────────────────────────────────────
// adminSchema.index({ email: 1 });

module.exports = mongoose.model("Admin", adminSchema);
