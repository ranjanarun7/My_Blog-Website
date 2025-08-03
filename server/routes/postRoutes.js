const express = require("express");
const Post = require("../models/Post");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// ✅ CREATE POST (Protected)
router.post("/", verifyToken, async (req, res) => {
  try {
    const newPost = new Post({
      ...req.body,
      author: req.user.username,
      authorId: req.user._id.toString(),  // 💡 safer
      date: new Date().toISOString(),
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("❌ Error creating post:", err);
    res.status(500).json({ error: "Failed to create post", details: err.message });
  }
});

// ✅ GET ALL POSTS (Public)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ _id: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch posts", details: err.message });
  }
});

// ✅ GET SINGLE POST (Public)
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.status(200).json(post);
  } catch (err) {
    console.error("❌ Error fetching post:", err);
    res.status(500).json({ error: "Failed to fetch post", details: err.message });
  }
});

// ✅ UPDATE POST (Protected + Ownership Check)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.authorId !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to update this post" });
    }

    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ Error updating post:", err);
    res.status(500).json({ error: "Failed to update post", details: err.message });
  }
});

// ✅ DELETE POST (Protected + Ownership Check)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.authorId !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting post:", err);
    res.status(500).json({ error: "Failed to delete post", details: err.message });
  }
});

module.exports = router;
