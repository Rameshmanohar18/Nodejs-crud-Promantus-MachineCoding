import express from "express";
import {
  registerAdmin,
  loginAdmin,
  refreshToken,
  logoutAdmin,
} from "../Controllers/adminController.js";
import protectAdmin from "../Middleware/adminauthMiddleware.js";
import validate from "../Middleware/validationMiddleware.js";
import {
  registerSchema,
  loginSchema,
} from "../Validations/authValidation.js";

/**
 * adminRoutes accepts authLimiter from server.js so the strict
 * rate limit (5 req/15min) applies only to login & register.
 */
const createAdminRoutes = (authLimiter) => {
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

export default createAdminRoutes;
