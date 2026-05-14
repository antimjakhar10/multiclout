const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    purpose: {
      type: String,
      enum: ["register", "access", "login"],
      default: "register",
    },
  },
  { timestamps: true }
);

otpSchema.index({ mobile: 1, purpose: 1 }, { unique: true });

module.exports = mongoose.model("Otp", otpSchema);