const express = require("express");
const router = express.Router();

const {
  addCourse,
  getCourses,
  getAllCoursesAdmin,
  getCourseCategories,
  getSingleCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// public routes
router.get("/", getCourses);
router.get("/categories", getCourseCategories);

// admin routes
router.get("/admin/all", protect, adminOnly, getAllCoursesAdmin);
router.post("/add", protect, adminOnly, addCourse);
router.put("/:id", protect, adminOnly, updateCourse);
router.delete("/:id", protect, adminOnly, deleteCourse);

// single course
router.get("/:id", getSingleCourse);

module.exports = router;