const Otp = require("../models/Otp");
const User = require("../models/User");

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const validPurposes = ["register", "access", "login"];

exports.sendOtp = async (req, res) => {
  try {
    const { mobile, purpose = "access" } = req.body;
    const trimmedMobile = String(mobile || "").trim();

    if (!/^\d{10}$/.test(trimmedMobile)) {
      return res.status(400).json({
        success: false,
        message: "Valid 10-digit mobile number is required.",
      });
    }

    if (!validPurposes.includes(purpose)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP purpose.",
      });
    }

    const existingUser = await User.findOne({ phone: trimmedMobile });

    if (purpose === "register" && existingUser) {
      return res.status(400).json({
        success: false,
        message: "This mobile number is already registered. Please login.",
      });
    }

    if (purpose === "login" && !existingUser) {
      return res.status(404).json({
        success: false,
        message: "This mobile number is not registered. Please register first.",
      });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { mobile: trimmedMobile, purpose },
      {
        mobile: trimmedMobile,
        otp,
        expiresAt,
        verified: false,
        purpose,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log("===================================");
    console.log(`DEMO OTP for ${trimmedMobile}`);
    console.log(`Purpose: ${purpose}`);
    console.log(`OTP: ${otp}`);
    console.log("===================================");

    return res.status(200).json({
      success: true,
      message: "Demo OTP generated. Check backend terminal.",
      demoOtp: otp,
    });
  } catch (error) {
    console.error("sendOtp error:", error);

    if (error?.code === 11000) {
      return res.status(500).json({
        success: false,
        message:
          "OTP index conflict found. Drop old mobile unique index from otps collection and try again.",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP.",
      error: error.message,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp, purpose = "access" } = req.body;

    const trimmedMobile = String(mobile || "").trim();
    const trimmedOtp = String(otp || "").trim();

    if (!/^\d{10}$/.test(trimmedMobile)) {
      return res.status(400).json({
        success: false,
        message: "Valid 10-digit mobile number is required.",
      });
    }

    if (!/^\d{6}$/.test(trimmedOtp)) {
      return res.status(400).json({
        success: false,
        message: "Valid 6-digit OTP is required.",
      });
    }

    if (!validPurposes.includes(purpose)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP purpose.",
      });
    }

    const otpDoc = await Otp.findOne({
      mobile: trimmedMobile,
      purpose,
    });

    if (!otpDoc) {
      return res.status(404).json({
        success: false,
        message: "OTP not found. Please send OTP again.",
      });
    }

    if (otpDoc.expiresAt < new Date()) {
      await Otp.deleteOne({ mobile: trimmedMobile, purpose });
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new OTP.",
      });
    }

    if (otpDoc.otp !== trimmedOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    otpDoc.verified = true;
    await otpDoc.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      mobile: trimmedMobile,
      purpose,
    });
  } catch (error) {
    console.error("verifyOtp error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP.",
      error: error.message,
    });
  }
};

exports.checkOtpVerified = async (req, res) => {
  try {
    const { mobile, purpose = "register" } = req.query;

    const trimmedMobile = String(mobile || "").trim();

    if (!/^\d{10}$/.test(trimmedMobile)) {
      return res.status(400).json({
        success: false,
        message: "Valid mobile number is required.",
      });
    }

    if (!validPurposes.includes(purpose)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP purpose.",
      });
    }

    const otpDoc = await Otp.findOne({
      mobile: trimmedMobile,
      purpose,
    });

    return res.status(200).json({
      success: true,
      verified: !!otpDoc?.verified && otpDoc.expiresAt > new Date(),
    });
  } catch (error) {
    console.error("checkOtpVerified error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check OTP verification.",
      error: error.message,
    });
  }
};