const connectToMongo = require("./Database/db");
const express = require("express");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectToMongo();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_API_LINK || "http://localhost:3000", // Allow local dev
    credentials: true, // If you need to allow cookies, etc.
    optionsSuccessStatus: 200, // Legacy browsers support
  })
);

// Check if media directory exists, if not create it
const mediaDir = path.join(__dirname, "media");
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir);
}

// Middleware to serve media files with CORS headers
app.use("/media", (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_API_LINK || "http://localhost:3000");
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site'); // or 'cross-origin' if needed
  next();
}, express.static(mediaDir));

// Middleware to parse incoming JSON requests
app.use(express.json());

// API routes
app.get("/", (req, res) => {
  res.send("Hello 👋 I am Working Fine 🚀");
});

app.use("/api/student/auth", require("./routes/Student Api/credential.route"));
app.use("/api/faculty/auth", require("./routes/Faculty Api/credential.route"));
app.use("/api/admin/auth", require("./routes/Admin Api/credential.route"));
app.use("/api/student/details", require("./routes/Student Api/details.route"));
app.use("/api/faculty/details", require("./routes/Faculty Api/details.route"));
app.use("/api/admin/details", require("./routes/Admin Api/details.route"));
app.use("/api/timetable", require("./routes/Other Api/timetable.route"));
app.use("/api/material", require("./routes/Other Api/material.route"));
app.use("/api/notice", require("./routes/Other Api/notice.route"));
app.use("/api/subject", require("./routes/Other Api/subject.route"));
app.use("/api/marks", require("./routes/Other Api/marks.route"));
app.use("/api/branch", require("./routes/Other Api/branch.route"));

// Handle undefined routes (404)
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

// Handle unhandled promise rejections globally
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1); // Exit the process to avoid corrupted state
});

// Start the server
app.listen(port, () => {
  console.log(`Server Listening On http://localhost:${port}`);
});
