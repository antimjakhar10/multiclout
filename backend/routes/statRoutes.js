const express = require("express");
const router = express.Router();

const {
  addStat,
  getStats,
  getAllStatsAdmin,
  updateStat,
  deleteStat,
} = require("../controllers/statController");

const { protectAdmin } = require("../middleware/authMiddleware");

router.get("/", getStats);

// ADMIN
router.get("/admin/all", protectAdmin, getAllStatsAdmin);
router.post("/add", protectAdmin, addStat);
router.put("/:id", protectAdmin, updateStat);
router.delete("/:id", protectAdmin, deleteStat);

module.exports = router;