const express = require("express");
const router = express.Router();

const {
  addReason,
  getReasons,
  getAllReasonsAdmin,
  updateReason,
  deleteReason,
} = require("../controllers/reasonController");

const { protectAdmin } = require("../middleware/authMiddleware");

// public
router.get("/", getReasons);

// admin
router.get("/admin/all", protectAdmin, getAllReasonsAdmin);
router.post("/add", protectAdmin, addReason);
router.put("/:id", protectAdmin, updateReason);
router.delete("/:id", protectAdmin, deleteReason);

module.exports = router;