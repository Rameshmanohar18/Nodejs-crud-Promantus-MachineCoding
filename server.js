import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import connectDb from "./DB/connection.js";
import setupSwagger from "./Config/Swagger.js";
import requestId from "./Middleware/requestIdMiddleware.js";
import createAdminRoutes from "./Routes/adminRoutes.js";
import userRoutes from "./Routes/userRoutes.js";

dotenv.config();

// ─── Environment Variable Validation ───────────────────────────────────────────
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`❌ FATAL ERROR: Missing required environment variables: ${missingEnvVars.join(", ")}`);
  process.exit(1);
}

const app = express();

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());                        // Secure HTTP headers
app.use(cors());                          // Cross-Origin Resource Sharing

// ─── Performance Middleware ────────────────────────────────────────────────────
app.use(compression());                   // Gzip compress all responses

// ─── Request ID ────────────────────────────────────────────────────────────────
app.use(requestId);                       // Attach X-Request-Id to every request

// ─── Global Rate Limit (100 req / 15 min per IP) ──────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again after 15 minutes" },
});
app.use(globalLimiter);

// ─── Strict Auth Rate Limit (5 attempts / 15 min per IP) ──────────────────────
// Applied only to login & register routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many login attempts, please try again after 15 minutes" },
});

// ─── Request Logging ───────────────────────────────────────────────────────────
app.use(morgan("dev"));                   // METHOD /path STATUS ms

// ─── Body Parser ───────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Database ──────────────────────────────────────────────────────────────────
connectDb();

// ─── Swagger Docs ──────────────────────────────────────────────────────────────
setupSwagger(app);

// ─── Health Routes ─────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.send("Hello Welcome to the Backend of Admin CRUD Operations");
});

app.get("/check", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/admin", createAdminRoutes(authLimiter));
app.use("/api/users", userRoutes);

// http://localhost:5000/api/user

// ─── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ─── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Server Error",
  });
});

// ─── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// ─── Graceful Shutdown ─────────────────────────────────────────────────────────
// Allows in-flight requests to finish before closing
const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log("Server closed. Exiting process.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// ─── Unhandled Promise Rejection Guard ────────────────────────────────────────
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  server.close(() => process.exit(1));
});
