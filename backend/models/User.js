const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    subscriptionStatus: {
      type: String,
      enum: ["inactive", "trial", "active"],
      default: "inactive",
    },
    subscriptionPlan: {
      type: String,
      enum: ["none", "trial_monthly", "yearly"],
      default: "none",
    },
    subscriptionAmount: {
      type: Number,
      default: 0,
    },
    subscriptionStartDate: {
      type: Date,
      default: null,
    },
    subscriptionEndDate: {
      type: Date,
      default: null,
    },
    hasAcceptedTerms: {
      type: Boolean,
      default: false,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed", "skipped"],
      default: "pending",
    },
    razorpaySubscriptionId: {
      type: String,
      default: "",
    },
    razorpayPlanId: {
      type: String,
      default: "",
    },
    subscriptionBillingCycle: {
      type: String,
      enum: ["none", "monthly", "yearly"],
      default: "none",
    },
    subscriptionAutoPay: {
      type: Boolean,
      default: false,
    },
    subscriptionCancelledAt: {
      type: Date,
      default: null,
    },
    businessMembershipStatus: {
      type: String,
      enum: ["inactive", "active"],
      default: "inactive",
    },
    businessMembershipPlan: {
      type: String,
      default: "none",
    },
    businessMembershipAmount: {
      type: Number,
      default: 0,
    },
    businessMembershipStartDate: {
      type: Date,
      default: null,
    },
    businessMembershipEndDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
