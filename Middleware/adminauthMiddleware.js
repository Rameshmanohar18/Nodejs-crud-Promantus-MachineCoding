const jwt = require("jsonwebtoken");
const Admin = require("../Model/admin");

const protectAdmin = async (req, res, next) => {

  
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please refresh" });
    }
    
    // Log the exact error to the terminal to see what went wrong (e.g., malformed token, bad signature)
    console.error("JWT Verification Error:", error.message);
    
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = protectAdmin;
