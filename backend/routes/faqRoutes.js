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

const { protectAdmin } = require("../middleware/authMiddleware");

router.get("/", getFAQs);
router.get("/admin/all", protectAdmin, getAllFAQsAdmin);
router.post("/add", protectAdmin, addFAQ);
router.put("/:id", protectAdmin, updateFAQ);
router.delete("/:id", protectAdmin, deleteFAQ);
router.get("/:id", getSingleFAQ);

module.exports = router;