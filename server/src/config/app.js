const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// Configure CORS with specific origins and robust preflight handling
const allowedOrigins = [
  process.env.CLIENT_URL || "https://laundry-ola-new.vercel.app",
  "http://localhost:5173",
  "https://laundry-ola-new.vercel.app",
];

// Manual CORS shim to ensure headers are present even on errors and 404s
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    // Reflect requested headers or fall back to common ones
    const reqHeaders = req.headers["access-control-request-headers"];
    res.header(
      "Access-Control-Allow-Headers",
      reqHeaders || "Content-Type, Authorization"
    );
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
  }
  next();
});

// Keep cors() with permissive reflection to cover non-browser clients; our shim enforces allowlist
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));

// Only parse JSON body for POST, PUT, PATCH requests
app.use((req, res, next) => {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

// API routes
app.use("/api", require("../routes/index"));

// Swagger API docs (temporarily disabled)
// const swaggerUi = require("swagger-ui-express");
// const YAML = require("yamljs");
// const swaggerDocument = YAML.load("./docs/swagger.yaml");
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handler
app.use(require("../middlewares/errorHandler"));

// Catch-all for unhandled routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Catch-all for uncaught errors (last middleware)
app.use((err, req, res, next) => {
  console.error("Uncaught error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

module.exports = app;
