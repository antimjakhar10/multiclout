const express = require("express");
const router = express.Router();

const {
  addReason,
  getReasons,
  getAllReasonsAdmin,
  updateReason,
  deleteReason,
} = require("../controllers/reasonController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getReasons);
router.get("/admin/all", protect, adminOnly, getAllReasonsAdmin);
router.post("/add", protect, adminOnly, addReason);
router.put("/:id", protect, adminOnly, updateReason);
router.delete("/:id", protect, adminOnly, deleteReason);

module.exports = router;