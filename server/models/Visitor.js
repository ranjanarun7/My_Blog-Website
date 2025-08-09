const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String },
  ip: String,
  country: String,
  city: String,
  userAgent: String,
  path: String,
  visitedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Visitor", visitorSchema);
