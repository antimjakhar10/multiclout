const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/Otp");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, phone and password are required",
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Valid 10-digit phone number is required",
      });
    }

    // ✅ OTP VERIFIED CHECK
    const otpDoc = await Otp.findOne({
      mobile: phone.trim(),
      purpose: "register",
    });

    if (!otpDoc || !otpDoc.verified || otpDoc.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Please verify OTP before registration",
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { phone },
        ...(email ? [{ email: email.toLowerCase() }] : []),
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email ? email.toLowerCase().trim() : "",
      phone: phone.trim(),
      password: hashedPassword,
      isVerified: true,
      subscriptionStatus: "inactive",
      subscriptionPlan: "none",
      subscriptionAmount: 0,
      hasAcceptedTerms: false,
      onboardingCompleted: false,
      paymentStatus: "pending",
    });

    // ✅ OTP CLEANUP
    await Otp.deleteOne({
      mobile: phone.trim(),
      purpose: "register",
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      isNewUser: true,
      needsOnboarding: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error) {
    console.error("registerUser error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({
        success: false,
        message: "Email or phone and password are required",
      });
    }

    const user = await User.findOne({
      $or: [
        ...(email ? [{ email: email.toLowerCase() }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password || "");

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      isNewUser: false,
      needsOnboarding: !user.onboardingCompleted,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error) {
    console.error("loginUser error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// ================= OTP ACCESS (LOGIN/ENTRY) =================
exports.otpAccess = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Valid phone number required",
      });
    }

    const otpDoc = await Otp.findOne({
      mobile: phone.trim(),
      purpose: "access",
    });

    if (!otpDoc || !otpDoc.verified || otpDoc.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP verification required",
      });
    }

    const user = await User.findOne({ phone: phone.trim() });

    // 👉 NEW USER
    if (!user) {
      return res.status(200).json({
        success: true,
        isNewUser: true,
        needsRegistration: true,
        phone,
      });
    }

    // 👉 EXISTING USER LOGIN
    const token = generateToken(user);

    await Otp.deleteOne({
      mobile: phone.trim(),
      purpose: "access",
    });

    return res.status(200).json({
      success: true,
      isNewUser: false,
      needsRegistration: false,
      token,
      needsOnboarding: !user.onboardingCompleted,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error) {
    console.error("otpAccess error:", error);
    res.status(500).json({
      success: false,
      message: "OTP access failed",
      error: error.message,
    });
  }
};

// ================= GET ME =================
exports.getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};