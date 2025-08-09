// routes/admin.js
const express = require("express");
const geoip = require("geoip-lite");
const jwt = require("jsonwebtoken");
const Visitor = require("../models/Visitor.js");
const User = require("../models/User.js");
const adminOnly = require("../middleware/adminOnly.js");

const router = express.Router();

/* ---------------------------------
   📌 Track Visitor (with logged-in user info)
----------------------------------- */
router.post("/track", async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip) || {};

    let username = null;
    let email = null;

    const authHeader = req.headers.authorization;
    if (authHeader) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Now decoded will have username & email
        username = decoded.username;
        email = decoded.email;
      } catch (err) {
        console.warn("Invalid token in /track:", err.message);
      }
    }

    await Visitor.create({
      username,
      email,
      ip,
      country: geo.country || "Unknown",
      city: geo.city || "Unknown",
      userAgent: req.headers["user-agent"],
      path: req.body.path || "/",
    });

    res.json({ message: "Tracked" });
  } catch (err) {
    console.error("Error tracking visitor:", err);
    res.status(500).json({ error: "Tracking failed" });
  }
});


/* ---------------------------------
   📌 Get Visitor Analytics (Admin only)
----------------------------------- */
router.get("/analytics", adminOnly, async (req, res) => {
  try {
    const visitors = await Visitor.find()
      .sort({ visitedAt: -1 })
      .limit(100);

    res.json(visitors);
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

/* ---------------------------------
   📌 Get Registered Users (Admin only)
----------------------------------- */
router.get("/users", adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, "username email role createdAt")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

/* ---------------------------------
   📌 Combined Dashboard Data (Admin only)
----------------------------------- */
// 📌 Combined Dashboard Data (Admin only)
router.get("/dashboard", adminOnly, async (req, res) => {
  try {
    // 🔹 Last 1 month ka date calculate
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Visitors last 1 month ke
    const visitors = await Visitor.find({ visitedAt: { $gte: oneMonthAgo } })
      .sort({ visitedAt: -1 })
      .limit(100);

    // All registered users (newest first)
    const users = await User.find({}, "username email role createdAt")
      .sort({ createdAt: -1 });

    // Total user count
    const totalUsers = users.length;

    res.json({
      totalUsers,  // ✅ Total count
      users,       // ✅ Full user list with username & email
      visitors     // ✅ Last 1 month visitors
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});


module.exports = router;
