const mongoose = require("mongoose");
module.exports = mongoose.model("Post", new mongoose.Schema({
  author: String,
  recruiterEmail: String,
  text: String,
  location: String,
  country: String, // "US", "IN", "UK"
  createdAt: { type: Date, default: Date.now },
}));