const express = require("express");
const router = express.Router();

const {
  addMentor,
  getMentors,
  getAllMentorsAdmin,
  getSingleMentor,
  updateMentor,
  deleteMentor,
} = require("../controllers/mentorController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// public
router.get("/", getMentors);

// admin
router.get("/admin/all", protect, adminOnly, getAllMentorsAdmin);
router.post("/add", protect, adminOnly, addMentor);
router.put("/:id", protect, adminOnly, updateMentor);
router.delete("/:id", protect, adminOnly, deleteMentor);

// single
router.get("/:id", getSingleMentor);

module.exports = router;