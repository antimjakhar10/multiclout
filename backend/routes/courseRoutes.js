const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  addCourse,
  getCourses,
  getAllCoursesAdmin,
  getCourseCategories,
  getSingleCourse,
  getCourseBySlug,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const { protectAdmin } = require("../middleware/authMiddleware");

const coursesUploadPath = path.join(__dirname, "..", "uploads", "courses");

if (!fs.existsSync(coursesUploadPath)) {
  fs.mkdirSync(coursesUploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, coursesUploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "-")
      .toLowerCase();

    cb(null, `${Date.now()}-${baseName}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// public routes
router.get("/", getCourses);
router.get("/categories", getCourseCategories);
router.get("/slug/:slug", getCourseBySlug);

// admin routes
router.get("/admin/all", protectAdmin, getAllCoursesAdmin);
router.post("/add", protectAdmin, upload.single("image"), addCourse);
router.put("/:id", protectAdmin, upload.single("image"), updateCourse);
router.delete("/:id", protectAdmin, deleteCourse);

// single course by id
router.get("/:id", getSingleCourse);

module.exports = router;