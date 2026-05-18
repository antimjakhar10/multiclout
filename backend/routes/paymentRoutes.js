const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  createPaymentOrder,
  verifyPaymentAndActivatePlan,
  markPaymentFailed,
  createCoursePaymentOrder,
  verifyCoursePaymentAndCreateOrder,
  createVideoSubscription,
  verifyVideoSubscription,
} = require("../controllers/paymentController");

router.post("/create-order", protect, createPaymentOrder);
router.post("/verify", protect, verifyPaymentAndActivatePlan);
router.post("/fail", protect, markPaymentFailed);

router.post("/course/create-order", protect, createCoursePaymentOrder);
router.post("/course/verify", protect, verifyCoursePaymentAndCreateOrder);

router.post("/video-subscription/create", protect, createVideoSubscription);
router.post("/video-subscription/verify", protect, verifyVideoSubscription);

module.exports = router;