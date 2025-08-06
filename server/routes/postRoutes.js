const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const Post = require("../models/Post");
const verifyToken = require("../middleware/auth");

const router = express.Router();

/* --------------------------
   ✅ Ensure uploads/ exists
--------------------------- */
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* --------------------------
   ✅ Multer config
--------------------------- */
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

/* --------------------------
   ✅ CREATE POST
--------------------------- */
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    //console.log("🧪 Form Data:", req.body);
    //console.log("🖼️ Uploaded File:", req.file);
    //console.log("👤 Authenticated User:", req.user);

    const { title, content, status, category, language } = req.body;

    if (!title || !content || !status) {
      return res.status(400).json({ error: "Title, content, and status are required." });
    }

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized - user not authenticated." });
    }

    const image = req.file ? req.file.filename : null;

    const newPost = new Post({
      title,
      content,
      status,
      image,
      category,
      language,
      author: req.user.username,
      authorId: req.user._id?.toString(),
      date: new Date().toISOString(),
    });

    const savedPost = await newPost.save();
    console.log("✅ Post created:", savedPost);
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("❌ Error creating post:", err);
    res.status(500).json({
      error: "Failed to create post",
      message: err.message,
      stack: err.stack,
    });
  }
});


/* --------------------------
   ✅ GET ALL POSTS
--------------------------- */
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
    //console.error("❌ Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch posts", details: err.message });
  }
});

/* --------------------------
   ✅ GET SINGLE POST
--------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.status(200).json(post);
  } catch (err) {
    //console.error("❌ Error fetching post:", err);
    res.status(500).json({ error: "Failed to fetch post", details: err.message });
  }
});

/* --------------------------
   ✅ UPDATE POST
--------------------------- */
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
    //console.error("❌ Error updating post:", err);
    res.status(500).json({ error: "Failed to update post", details: err.message });
  }
});

/* --------------------------
   ✅ DELETE POST
--------------------------- */
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
    //console.error("❌ Error deleting post:", err);
    res.status(500).json({ error: "Failed to delete post", details: err.message });
  }
});

module.exports = router;
