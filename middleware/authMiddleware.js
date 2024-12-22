const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach user info to the request
    next(); // Move to the next middleware or route handler
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticate;
