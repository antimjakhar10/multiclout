const express = require("express");
const router = express.Router();

const {
  addStat,
  getStats,
  getAllStatsAdmin,
  updateStat,
  deleteStat,
} = require("../controllers/statController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getStats);
router.get("/admin/all", protect, adminOnly, getAllStatsAdmin);
router.post("/add", protect, adminOnly, addStat);
router.put("/:id", protect, adminOnly, updateStat);
router.delete("/:id", protect, adminOnly, deleteStat);

module.exports = router;