function errorHandler(err, req, res, next) {
  console.error("Error handler caught:", err);

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload",
    });
  }

  // Handle other errors
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}

module.exports = errorHandler;
