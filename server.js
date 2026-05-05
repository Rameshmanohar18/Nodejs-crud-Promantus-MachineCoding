const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./DB/connection");
const setupSwagger = require("./Config/Swagger");

dotenv.config();

const app = express();

// Middleware 


app.use(express.json());

// Connect to MongoDB
connectDb();

// Swagger Docs
setupSwagger(app);

// Health Routes
app.get("/", (req, res) => {
  res.send("Hello Welcome to the Backend of Admin CRUD Operations");
});

app.get("/check", (req, res) => {
  res.send("Server Working");
});

// Routes
app.use("/api/admin", require("./Routes/adminRoutes"));
app.use("/api/users", require("./Routes/userRoutes"));

// Global Error Handler (must be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});

// Port
const PORT = process.env.PORT || 3000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on the port ${PORT}`);
});
