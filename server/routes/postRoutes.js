const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const Post = require("../models/Post");
const verifyToken = require("../middleware/auth");

const router = express.Router();

/* --------------------------
   ✅ Cloudinary Config
--------------------------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* --------------------------
   ✅ Multer + Cloudinary Storage
--------------------------- */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blog-uploads", // 👈 Cloudinary folder
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 1200, height: 800, crop: "limit" }],
  },
});

const upload = multer({ storage });

/* --------------------------
   ✅ CREATE POST
--------------------------- */
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { title, content, status, category, language } = req.body;

    if (!title || !content || !status) {
      return res.status(400).json({ error: "Title, content, and status are required." });
    }

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized - user not authenticated." });
    }

    const imageUrl = req.file ? req.file.path : null; // ✅ Cloudinary image URL

    const newPost = new Post({
      title,
      content,
      status,
      image: imageUrl, // ✅ Save Cloudinary URL in DB
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
      updatedData.image = req.file.path; // ✅ Cloudinary URL
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedPost);
  } catch (err) {
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
    res.status(500).json({ error: "Failed to delete post", details: err.message });
  }
});

module.exports = router;
