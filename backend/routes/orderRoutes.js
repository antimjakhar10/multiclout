const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  checkCoursePurchase,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/check-course/:courseId", protect, checkCoursePurchase);

module.exports = router;