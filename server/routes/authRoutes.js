const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const geoip = require("geoip-lite");
const User = require("../models/User");
const Visitor = require("../models/Visitor"); // ✅ import visitor model

const router = express.Router();

// 📌 Helper function to log user activity with user info
async function logUserActivity(req, path, user = null) {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const geo = geoip.lookup(ip) || {};

  await Visitor.create({
    ip,
    country: geo.country || "Unknown",
    city: geo.city || "Unknown",
    userAgent: req.headers["user-agent"],
    path: path || "/",
    visitedAt: new Date(),
    username: user?.username || null, // ✅ add username
    email: user?.email || null        // ✅ add email
  });
}


// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: req.body.role || "user"
    });
    const savedUser = await newUser.save();

    // ✅ Log this registration in visitor analytics
    await logUserActivity(req, "/register", savedUser);


    res.status(201).json({
      message: "User registered",
      user: {
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Registration failed", details: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Log this login in visitor analytics
    await logUserActivity(req, "/login", user);


    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

module.exports = router;
