const express = require("express");
const router = express.Router();
const {
  sendOtp,
  verifyOtp,
  checkOtpVerified,
} = require("../controllers/otpController");

router.post("/send", sendOtp);
router.post("/verify", verifyOtp);
router.get("/status", checkOtpVerified);

module.exports = router;