const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema(
  {
    text: { type: String, default: "" },
  },
  { _id: false },
);

const planSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    title: { type: String, default: "" },
    price: { type: String, default: "" },
    oldPrice: { type: String, default: "" },

    trialPrice: { type: String, default: "" },
    recurringPrice: { type: String, default: "" },

    billingCycle: {
      type: String,
      enum: ["none", "monthly", "yearly"],
      default: "none",
    },

    trialDays: {
      type: Number,
      default: 0,
    },

    autopayEnabled: {
      type: Boolean,
      default: false,
    },

    razorpayPlanId: {
      type: String,
      default: "",
    },

    badge: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    buttonLink: { type: String, default: "" },
    buttonText: { type: String, default: "" },
    active: { type: Boolean, default: true },
    popular: { type: Boolean, default: false },
    features: { type: [featureSchema], default: [] },
  },
  { _id: false },
);

const planSettingsSchema = new mongoose.Schema(
  {
    mobileSection: {
      badge: { type: String, default: "Premium Access" },
      heading: { type: String, default: "Choose your plan" },
      subtitle: {
        type: String,
        default: "Unlock all videos or continue with basic access",
      },
      heroVideo: { type: String, default: "" },
      buyButtonText: { type: String, default: "Buy Plan" },
      continueButtonText: { type: String, default: "Continue Without Plan" },
      termsText: { type: String, default: "I agree to Terms & Conditions" },
      plans: { type: [planSchema], default: [] },
    },

    businessSection: {
      badge: { type: String, default: "Business Plans" },
      heading: {
        type: String,
        default: "Choose the right plan for your growth",
      },
      subtitle: {
        type: String,
        default: "Simple pricing for creators, learners and business users.",
      },
      ctaText: { type: String, default: "Get Started" },
      plans: { type: [planSchema], default: [] },
    },

    memberSection: {
      badge: { type: String, default: "Membership Plans" },
      heading: {
        type: String,
        default: "Become a Member",
      },
      subtitle: {
        type: String,
        default:
          "Choose a membership plan to unlock earning access and member benefits.",
      },
      ctaText: { type: String, default: "Join Now" },
      plans: { type: [planSchema], default: [] },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PlanSettings", planSettingsSchema);
