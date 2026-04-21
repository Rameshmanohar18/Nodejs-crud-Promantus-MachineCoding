const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDb = require("./DB/connection");
dotenv.config();

app.get("/", (req, res) => {
  res.send("Hello Welcome to the Backend of Admin CRUD Operations");
});

// Middleware
app.use(express.json());                                         

// Connect to MongoDB
connectDb();
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});

// Test Route
app.get("/check", (req, res) => {
  res.send("Server Working");
});

//Routes
// app.use("/api", require("./Routes/userRoutes"));
app.use("/api/admin", require("./Routes/adminRoutes"));

app.use("/api/users", require("./Routes/userRoutes"));

// Rate Limiting
// app.use(limiter);

//Port
const PORT = process.env.PORT || 3000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on the port ${PORT}`);
});
