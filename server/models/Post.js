const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  image: String,
  category: String,
  author: String,   
  authorId: String,
  date: String,
  context: String,
});

module.exports = mongoose.model("Post", postSchema);
