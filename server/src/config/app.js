const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

app.use(cors());
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

// Swagger API docs
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./docs/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
