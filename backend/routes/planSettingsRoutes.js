const express = require("express");
const router = express.Router();

const {
  getPlanSettings,
  updatePlanSettings,
} = require("../controllers/planSettingsController");

const { protectAdmin } = require("../middleware/authMiddleware");

router.get("/", getPlanSettings);
router.put("/admin/update", protectAdmin, updatePlanSettings);

module.exports = router;