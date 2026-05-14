const Blog = require("../models/Blog");

const buildImageUrl = (req, fileName) => {
  if (!fileName) return "";
  return `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
};

const slugify = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map((tag) => String(tag).trim()).filter(Boolean);
  return String(tags)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const estimateReadTime = (content = "") => {
  const wordCount = String(content).trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
};

// PUBLIC - all published blogs
const getPublishedBlogs = async (req, res) => {
  try {
    const { category, search } = req.query;

    const query = {
      status: "published",
    };

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { tags: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }

    const blogs = await Blog.find(query).sort({ featured: -1, publishedAt: -1, createdAt: -1 });

    res.json({
      success: true,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};

// PUBLIC - single published blog by slug
const getPublishedBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      status: "published",
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      status: "published",
      $or: [
        { category: blog.category },
        { tags: { $in: blog.tags } },
      ],
    })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(3);

    res.json({
      success: true,
      blog,
      relatedBlogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message,
    });
  }
};

// ADMIN - all blogs
const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin blogs",
      error: error.message,
    });
  }
};

// ADMIN - create blog
const createBlog = async (req, res) => {
  try {
    const {
      title,
      seoTitle,
seoDescription,
seoKeywords,
      excerpt,
      content,
      category,
      author,
      tags,
      featured,
      status,
      publishedAt,
    } = req.body;

    if (!title || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, excerpt and content are required",
      });
    }

    let slug = slugify(title);

    const existingSlug = await Blog.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const image = req.file ? buildImageUrl(req, req.file.filename) : "";

    const blog = await Blog.create({
      title,
      seoTitle: seoTitle || "",
seoDescription: seoDescription || "",
seoKeywords: seoKeywords || "",
      slug,
      excerpt,
      content,
      image,
      category: category || "General",
      author: author || "Multiclout Team",
      tags: parseTags(tags),
      featured: featured === "true" || featured === true,
      status: status || "published",
      readTime: estimateReadTime(content),
      publishedAt: publishedAt || new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
};

// ADMIN - update blog
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const {
      title,
      seoTitle,
seoDescription,
seoKeywords,
      excerpt,
      content,
      category,
      author,
      tags,
      featured,
      status,
      publishedAt,
    } = req.body;

    let slug = blog.slug;

    if (title && title !== blog.title) {
      slug = slugify(title);
      const existingSlug = await Blog.findOne({
        slug,
        _id: { $ne: blog._id },
      });

      if (existingSlug) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    let image = blog.image;
    if (req.file) {
      image = buildImageUrl(req, req.file.filename);
    }

    blog.title = title ?? blog.title;
    blog.seoTitle = seoTitle ?? blog.seoTitle;
blog.seoDescription = seoDescription ?? blog.seoDescription;
blog.seoKeywords = seoKeywords ?? blog.seoKeywords;
    blog.slug = slug;
    blog.excerpt = excerpt ?? blog.excerpt;
    blog.content = content ?? blog.content;
    blog.category = category ?? blog.category;
    blog.author = author ?? blog.author;
    blog.tags = tags !== undefined ? parseTags(tags) : blog.tags;
    blog.featured =
      featured !== undefined
        ? featured === "true" || featured === true
        : blog.featured;
    blog.status = status ?? blog.status;
    blog.image = image;
    blog.readTime = estimateReadTime(blog.content);
    blog.publishedAt = publishedAt || blog.publishedAt;

    await blog.save();

    res.json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: error.message,
    });
  }
};

// ADMIN - delete blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    await blog.deleteOne();

    res.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
      error: error.message,
    });
  }
};

// PUBLIC - categories
const getBlogCategories = async (req, res) => {
  try {
    const categories = await Blog.distinct("category", { status: "published" });

    res.json({
      success: true,
      categories: ["All", ...categories.filter(Boolean)],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

module.exports = {
  getPublishedBlogs,
  getPublishedBlogBySlug,
  getAllBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogCategories,
};