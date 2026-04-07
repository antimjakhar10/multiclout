const express = require("express");
const router = express.Router();

const {
  addReel,
  getReels,
  getAllReelsAdmin,
  getReelCategories,
  getSingleReel,
  updateReel,
  deleteReel,
} = require("../controllers/reelController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// public
router.get("/", getReels);
router.get("/categories", getReelCategories);

// admin
router.get("/admin/all", protect, adminOnly, getAllReelsAdmin);
router.post("/add", protect, adminOnly, addReel);
router.put("/:id", protect, adminOnly, updateReel);
router.delete("/:id", protect, adminOnly, deleteReel);

// single
router.get("/:id", getSingleReel);

module.exports = router;