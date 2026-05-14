const express = require("express");
const router = express.Router();
const {
  getAllUsersAdmin,
  deleteUserAdmin,
  updateMyProfile,
  completeOnboarding,
  activateSubscriptionPlan,
  deleteMyAccount,
} = require("../controllers/userController");
const { protect, protectAdmin } = require("../middleware/authMiddleware");

router.get("/admin/all", protectAdmin, getAllUsersAdmin);
router.delete("/admin/:id", protectAdmin, deleteUserAdmin);

router.put("/me", protect, updateMyProfile);
router.post("/onboarding/complete", protect, completeOnboarding);
router.post("/subscription/activate", protect, activateSubscriptionPlan);
router.delete("/me", protect, deleteMyAccount);

module.exports = router;