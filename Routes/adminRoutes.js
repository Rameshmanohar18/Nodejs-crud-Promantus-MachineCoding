const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  refreshToken,
  logoutAdmin,
} = require("../Controllers/adminController");
const protectAdmin = require("../Middleware/adminauthMiddleware");
const validate = require("../Middleware/validationMiddleware");
const {
  registerSchema,
  loginSchema,
} = require("../Validations/authValidation");

/**
 * adminRoutes accepts authLimiter from server.js so the strict
 * rate limit (5 req/15min) applies only to login & register.
 */
module.exports = (authLimiter) => {
  const router = express.Router();

  // ─── Public Routes (strict rate limited) ────────────────────────────────────
  router.post("/register", authLimiter, validate(registerSchema), registerAdmin);
  router.post("/login", authLimiter, validate(loginSchema), loginAdmin);
  router.post("/refresh-token", refreshToken);
  router.post("/logout", logoutAdmin);

  // ─── Protected Routes ────────────────────────────────────────────────────────
  router.get("/profile", protectAdmin, (req, res) => {
    res.json({
      message: "Admin Profile",
      admin: {
        _id: req.admin._id,
        name: req.admin.name,
        email: req.admin.email,
        role: req.admin.role,
      },
    });
  });

  return router;
};
