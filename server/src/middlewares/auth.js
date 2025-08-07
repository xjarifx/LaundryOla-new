const jwt = require("jsonwebtoken");

function authenticate(role) {
  return (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (role && decoded.role !== role) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  };
}

module.exports = { authenticate };
