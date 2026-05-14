const express = require("express");
const router = express.Router();

const {
  addTutorial,
  getTutorials,
  getAllTutorialsAdmin,
  getSingleTutorial,
  updateTutorial,
  deleteTutorial,
} = require("../controllers/tutorialController");

const { protectAdmin } = require("../middleware/authMiddleware");

// public
router.get("/", getTutorials);

// admin
router.get("/admin/all", protectAdmin, getAllTutorialsAdmin);
router.post("/add", protectAdmin, addTutorial);
router.put("/:id", protectAdmin, updateTutorial);
router.delete("/:id", protectAdmin, deleteTutorial);

// single
router.get("/:id", getSingleTutorial);

module.exports = router;