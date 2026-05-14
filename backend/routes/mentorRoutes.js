const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  addMentor,
  getMentors,
  getAllMentorsAdmin,
  getSingleMentor,
  updateMentor,
  deleteMentor,
} = require("../controllers/mentorController");

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
router.get("/", getMentors);

// admin
router.get("/admin/all", protectAdmin, getAllMentorsAdmin);
router.post("/add", protectAdmin, upload.single("image"), addMentor);
router.put("/:id", protectAdmin, upload.single("image"), updateMentor);
router.delete("/:id", protectAdmin, deleteMentor);

// single
router.get("/:id", getSingleMentor);

module.exports = router;