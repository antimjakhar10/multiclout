const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  addTestimonial,
  getTestimonials,
  getAllTestimonialsAdmin,
  getSingleTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");

const { protectAdmin } = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// public
router.get("/", getTestimonials);

// admin
router.get("/admin/all", protectAdmin, getAllTestimonialsAdmin);
router.post("/add", protectAdmin, upload.single("image"), addTestimonial);
router.put("/:id", protectAdmin, upload.single("image"), updateTestimonial);
router.delete("/:id", protectAdmin, deleteTestimonial);

// single
router.get("/:id", getSingleTestimonial);

module.exports = router;