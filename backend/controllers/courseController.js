const Course = require("../models/Course");
const fs = require("fs");
const path = require("path");

const deleteLocalFile = (filePath) => {
  if (!filePath) return;

  const relativePath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
  const fullPath = path.join(__dirname, "..", relativePath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

const slugify = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ensureUniqueSlug = async (title, excludeId = null) => {
  const baseSlug = slugify(title);

  if (!baseSlug) {
    throw new Error("Valid course title is required to generate slug");
  }
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const existing = await Course.findOne({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    });

    if (!existing) return slug;

    slug = `${baseSlug}-${count}`;
    count += 1;
  }
};

const parseList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const parseSectionsText = (value) => {
  if (!value || typeof value !== "string") return [];

  const blocks = value
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (!lines.length) return null;

      const [sectionMeta, ...lessonLines] = lines;
      const [title = "", lecturesCount = "", duration = ""] = sectionMeta
        .split("|")
        .map((part) => part.trim());

      const lessons = lessonLines
        .map((line) => {
          const [
            lessonTitle = "",
            lessonDuration = "",
            lessonType = "video",
            lessonVideoUrl = "",
          ] = line.split("|").map((part) => part.trim());

          if (!lessonTitle) return null;

          return {
            title: lessonTitle,
            duration: lessonDuration,
            type: lessonType || "video",
            videoUrl: lessonVideoUrl || "",
          };
        })
        .filter(Boolean);

      if (!title) return null;

      return {
        title,
        lecturesCount,
        duration,
        lessons,
      };
    })
    .filter(Boolean);
};

// Add course (admin)
exports.addCourse = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      instructor,
      rating,
      totalRatings,
      learners,
      tag,
      bestseller,
      price,
      oldPrice,
      category,
      subcategory,
      previewVideo,
      description,
      seoTitle,
      seoDescription,
      seoKeywords,
      fullDescription,
      language,
      lastUpdatedText,
      duration,
      level,
      offerText,
      moneyBackDays,
      whatYouWillLearn,
      requirements,
      includes,
      outcomes,
      sectionsText,
      active,
      order,
    } = req.body;

    if (!title || !instructor || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, instructor, price and category are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Course image is required",
      });
    }

    const slug = await ensureUniqueSlug(title);

    const course = await Course.create({
      title,
      slug,
      subtitle: subtitle || "",
      instructor,
      rating: Number(rating) || 0,
      totalRatings: Number(totalRatings) || 0,
      learners: Number(learners) || 0,
      tag: tag || "",
      bestseller: bestseller === "true" || bestseller === true ? true : false,
      price: Number(price),
      oldPrice: Number(oldPrice) || 0,
      category,
      subcategory: subcategory || "",
      image: `/uploads/courses/${req.file.filename}`,
      previewVideo: previewVideo || "",
      description: description || "",
      seoTitle: seoTitle || "",
      seoDescription: seoDescription || "",
      seoKeywords: seoKeywords || "",
      fullDescription: fullDescription || "",
      language: language || "English",
      lastUpdatedText: lastUpdatedText || "",
      duration: duration || "",
      level: level || "All Levels",
      offerText: offerText || "",
      moneyBackDays: Number(moneyBackDays) || 30,
      whatYouWillLearn: parseList(whatYouWillLearn),
      requirements: parseList(requirements),
      includes: parseList(includes),
      outcomes: parseList(outcomes),
      sections: parseSectionsText(sectionsText),
      active: active === "false" || active === false ? false : true,
      order: Number(order) || 0,
    });

    res.status(201).json({
      success: true,
      message: "Course added successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add course",
      error: error.message,
    });
  }
};

// Get all active courses (public)
exports.getCourses = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = { active: true };

    if (category && category !== "All Categories") {
      filter.category = category;
    }

    const courses = await Course.find(filter).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

// Get all courses for admin
exports.getAllCoursesAdmin = async (req, res) => {
  try {
    const courses = await Course.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all courses",
      error: error.message,
    });
  }
};

// Get categories
exports.getCourseCategories = async (req, res) => {
  try {
    const categories = await Course.distinct("category", { active: true });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// Get single course by ID
exports.getSingleCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      error: error.message,
    });
  }
};

// Get single course by slug
exports.getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({
      slug: req.params.slug,
      active: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      error: error.message,
    });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const nextTitle = req.body.title ?? course.title;

    course.title = nextTitle;
    course.slug = await ensureUniqueSlug(nextTitle, course._id);
    course.subtitle = req.body.subtitle ?? course.subtitle;
    course.instructor = req.body.instructor ?? course.instructor;
    course.category = req.body.category ?? course.category;
    course.subcategory = req.body.subcategory ?? course.subcategory;
    course.tag = req.body.tag ?? course.tag;
    course.previewVideo = req.body.previewVideo ?? course.previewVideo;
    course.description = req.body.description ?? course.description;
    course.seoTitle = req.body.seoTitle ?? course.seoTitle;
course.seoDescription = req.body.seoDescription ?? course.seoDescription;
course.seoKeywords = req.body.seoKeywords ?? course.seoKeywords;
    course.fullDescription = req.body.fullDescription ?? course.fullDescription;
    course.language = req.body.language ?? course.language;
    course.lastUpdatedText = req.body.lastUpdatedText ?? course.lastUpdatedText;
    course.duration = req.body.duration ?? course.duration;
    course.level = req.body.level ?? course.level;
    course.offerText = req.body.offerText ?? course.offerText;

    if (req.body.rating !== undefined) {
      course.rating = Number(req.body.rating) || 0;
    }

    if (req.body.totalRatings !== undefined) {
      course.totalRatings = Number(req.body.totalRatings) || 0;
    }

    if (req.body.learners !== undefined) {
      course.learners = Number(req.body.learners) || 0;
    }

    if (req.body.price !== undefined) {
      course.price = Number(req.body.price) || 0;
    }

    if (req.body.oldPrice !== undefined) {
      course.oldPrice = Number(req.body.oldPrice) || 0;
    }

    if (req.body.moneyBackDays !== undefined) {
      course.moneyBackDays = Number(req.body.moneyBackDays) || 30;
    }

    if (req.body.order !== undefined) {
      course.order = Number(req.body.order) || 0;
    }

    if (req.body.active !== undefined) {
      course.active =
        req.body.active === "false" || req.body.active === false ? false : true;
    }

    if (req.body.bestseller !== undefined) {
      course.bestseller =
        req.body.bestseller === "true" || req.body.bestseller === true;
    }

    if (req.body.whatYouWillLearn !== undefined) {
      course.whatYouWillLearn = parseList(req.body.whatYouWillLearn);
    }

    if (req.body.requirements !== undefined) {
      course.requirements = parseList(req.body.requirements);
    }

    if (req.body.includes !== undefined) {
      course.includes = parseList(req.body.includes);
    }

    if (req.body.outcomes !== undefined) {
      course.outcomes = parseList(req.body.outcomes);
    }

    if (req.body.sectionsText !== undefined) {
      course.sections = parseSectionsText(req.body.sectionsText);
    }

    if (req.file) {
      deleteLocalFile(course.image);
      course.image = `/uploads/courses/${req.file.filename}`;
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findById(req.params.id);

    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    deleteLocalFile(deletedCourse.image);
    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};
