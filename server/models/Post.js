const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    image: { type: String },
    category: { type: String },
    language: { type: String },
    author: { type: String },
    authorId: { type: String },
    date: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
