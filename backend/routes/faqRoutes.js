const express = require("express");
const router = express.Router();

const {
  addFAQ,
  getFAQs,
  getAllFAQsAdmin,
  getSingleFAQ,
  updateFAQ,
  deleteFAQ,
} = require("../controllers/faqController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getFAQs);
router.get("/admin/all", protect, adminOnly, getAllFAQsAdmin);
router.post("/add", protect, adminOnly, addFAQ);
router.put("/:id", protect, adminOnly, updateFAQ);
router.delete("/:id", protect, adminOnly, deleteFAQ);
router.get("/:id", getSingleFAQ);

module.exports = router;