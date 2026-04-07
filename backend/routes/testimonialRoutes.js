const express = require("express");
const router = express.Router();

const {
  addTestimonial,
  getTestimonials,
  getAllTestimonialsAdmin,
  getSingleTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getTestimonials);
router.get("/admin/all", protect, adminOnly, getAllTestimonialsAdmin);
router.post("/add", protect, adminOnly, addTestimonial);
router.put("/:id", protect, adminOnly, updateTestimonial);
router.delete("/:id", protect, adminOnly, deleteTestimonial);
router.get("/:id", getSingleTestimonial);

module.exports = router;