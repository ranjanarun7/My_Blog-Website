const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function adminOnly(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded._id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    req.user = user; // ✅ user info available for next middleware/routes
    next();
  });
}

module.exports = adminOnly;
