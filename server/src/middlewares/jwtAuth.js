const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token required" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

function requireCustomer(req, res, next) {
  if (req.user.type !== "customer") {
    return res
      .status(403)
      .json({ success: false, message: "Customer access required" });
  }
  next();
}

function requireEmployee(req, res, next) {
  if (req.user.type !== "employee") {
    return res
      .status(403)
      .json({ success: false, message: "Employee access required" });
  }
  next();
}

module.exports = { authenticateToken, requireCustomer, requireEmployee };
