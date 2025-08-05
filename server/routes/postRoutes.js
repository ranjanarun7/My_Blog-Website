const express = require("express");
const Post = require("../models/Post");
const verifyToken = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// ✅ Multer config for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

/* -------------------------
   ✅ CREATE POST (Protected)
---------------------------- */
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { title, content, status, category, language } = req.body;
    const image = req.file ? req.file.filename : null;

    const newPost = new Post({
      title,
      content,
      status,
      image,
      category,
      language,
      author: req.user.username,
      authorId: req.user._id.toString(),
      date: new Date().toISOString(),
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("❌ Error creating post:", err);
    res.status(500).json({ error: "Failed to create post", details: err.message });
  }
});

/* -------------------------
   ✅ GET ALL POSTS (Filters)
---------------------------- */
router.get("/", async (req, res) => {
  try {
    const { search = "", year = "", language = "" } = req.query;

    let filter = {};

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (language) {
      filter.language = { $regex: language, $options: "i" };
    }

    if (year) {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${year}-12-31`);
      filter.createdAt = { $gte: start, $lte: end };
    }

    const posts = await Post.find(filter).sort({ _id: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch posts", details: err.message });
  }
});

/* -----------------------------
   ✅ GET SINGLE POST BY ID ONLY
------------------------------- */
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

/* -------------------------
   ✅ UPDATE POST (with Image)
---------------------------- */
router.put("/:id", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.authorId !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { title, content, status } = req.body;
    const updatedData = { title, content, status };

    if (req.file) {
      updatedData.image = req.file.filename;
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("❌ Error updating post:", err);
    res.status(500).json({ error: "Failed to update post", details: err.message });
  }
});

/* -------------------------
   ✅ DELETE POST (Protected)
---------------------------- */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.authorId !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting post:", err);
    res.status(500).json({ error: "Failed to delete post", details: err.message });
  }
});

module.exports = router;
