const express = require("express");
const { registerAdmin, loginAdmin } = require("../Controllers/adminController");
const protectAdmin = require("../Middleware/adminauthMiddleware");
const validate = require("../Middleware/validationMiddleware");
const { registerSchema, loginSchema } = require("../Validations/authValidation");

const router = express.Router();

// Public routes
router.post("/register", validate(registerSchema), registerAdmin);
router.post("/login", validate(loginSchema), loginAdmin);

// Protected route
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

module.exports = router;
