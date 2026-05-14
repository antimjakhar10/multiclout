const express = require("express");
const router = express.Router();

const { getDashboardSummary } = require("../controllers/adminDashboardController");
const adminProtect = require("../middleware/adminAuthMiddleware");

router.get("/summary", adminProtect, getDashboardSummary);

module.exports = router;