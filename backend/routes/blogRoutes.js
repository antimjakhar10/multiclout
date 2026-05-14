const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  getPublishedBlogs,
  getPublishedBlogBySlug,
  getAllBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogCategories,
} = require("../controllers/blogController");

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// public
router.get("/", getPublishedBlogs);
router.get("/categories", getBlogCategories);
router.get("/:slug", getPublishedBlogBySlug);

// admin
router.get("/admin/all", adminAuthMiddleware, getAllBlogsAdmin);
router.post("/admin/add", adminAuthMiddleware, upload.single("image"), createBlog);
router.put("/admin/update/:id", adminAuthMiddleware, upload.single("image"), updateBlog);
router.delete("/admin/delete/:id", adminAuthMiddleware, deleteBlog);

module.exports = router;