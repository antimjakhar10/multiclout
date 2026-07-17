const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, default: "" },
    answer: { type: String, default: "" },
  },
  { _id: false }
);

const smallCardSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    value: { type: String, default: "" },
    subtitle: { type: String, default: "" },
  },
  { _id: false }
);

const supportPointSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
  },
  { _id: false }
);

const legalPageSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    content: { type: String, default: "" },
  },
  { _id: false }
);

const siteSettingsSchema = new mongoose.Schema(
  {
    heroSection: {
      badge: {
        type: String,
        default: "Learn • Build • Grow With Multiclout",
      },
      titleLine1: {
        type: String,
        default: "Build Your Future With",
      },
      titleHighlight: {
        type: String,
        default: "Smart Business Learning",
      },
      description: {
        type: String,
        default:
          "Explore powerful business ideas, practical tutorials, and the right direction to grow with more clarity, confidence, and real support.",
      },
      primaryButtonText: {
        type: String,
        default: "Explore Business Plan",
      },
      primaryButtonLink: {
        type: String,
        default: "/business-plan",
      },
      secondaryButtonText: {
        type: String,
        default: "Watch Videos",
      },
      secondaryButtonLink: {
        type: String,
        default: "/watch-videos",
      },
      otpCardTitle: {
        type: String,
        default: "Get started with OTP",
      },
      otpCardSubtitle: {
        type: String,
        default: "Enter your mobile number to continue",
      },
      otpSendButtonText: {
        type: String,
        default: "Continue with OTP",
      },
      otpVerifyButtonText: {
        type: String,
        default: "Verify OTP",
      },
      otpHelperText: {
        type: String,
        default: "We’ll send an OTP for verification",
      },
      heroVideo: {
        type: String,
        default: "/videos/hero.mp4",
      },
    },

    contactPage: {
      badge: {
        type: String,
        default: "Multiclout • Official Customer Support",
      },
      heroTitle: {
        type: String,
        default: "Contact Support",
      },
      heroDescription: {
        type: String,
        default:
          "Get help from our official support team for account, learning, app and business related queries.",
      },

      callLabel: {
        type: String,
        default: "Call",
      },
      callValue: {
        type: String,
        default: "+91 99999 99999",
      },

      emailLabel: {
        type: String,
        default: "Email",
      },
      emailValue: {
        type: String,
        default: "support@multiclout.com",
      },

      companyTitle: {
        type: String,
        default: "Company",
      },
      companyName: {
        type: String,
        default: "Multiclout Private Limited",
      },
      companyAddress: {
        type: String,
        default: "India",
      },

      topCards: {
        type: [smallCardSchema],
        default: [
          {
            title: "Phone",
            value: "+91 99999 99999",
            subtitle: "( 9 AM – 6 PM )",
          },
          {
            title: "Email",
            value: "support@multiclout.com",
            subtitle: "Best for screenshots & details",
          },
          {
            title: "Languages",
            value: "Hindi • English",
            subtitle: "",
          },
        ],
      },

      supportPoints: {
        type: [supportPointSchema],
        default: [
          {
            title: "Official channels",
            subtitle: "Phone & email listed here",
          },
          {
            title: "Nationwide",
            subtitle: "Support across India",
          },
          {
            title: "Secure help",
            subtitle: "We never ask OTP",
          },
        ],
      },

      faqsTitle: {
        type: String,
        default: "Frequently asked questions",
      },
      faqsSubtitle: {
        type: String,
        default: "Click a question to expand.",
      },

      faqs: {
        type: [faqSchema],
        default: [
          {
            question: "How can I contact Multiclout support?",
            answer:
              "You can contact us through the official phone number or email listed on this page.",
          },
          {
            question: "How long does it take to receive a response?",
            answer:
              "Most queries are answered within standard working hours depending on the nature of the request.",
          },
        ],
      },
    },

    privacyPolicy: {
      type: legalPageSchema,
      default: {
        title: "Privacy Policy",
        content: "Privacy policy content goes here.",
      },
    },

    refundPolicy: {
      type: legalPageSchema,
      default: {
        title: "Refund Policy",
        content: "Refund policy content goes here.",
      },
    },

    termsAndConditions: {
      type: legalPageSchema,
      default: {
        title: "Terms & Conditions",
        content: "Terms and conditions content goes here.",
      },
    },

    franchiseTermsAndConditions: {
  type: legalPageSchema,
  default: {
    title: "Franchise Terms & Conditions",
    content: "Franchise terms and conditions content goes here.",
  },
},

    becomeAffiliate: {
      type: legalPageSchema,
      default: {
        title: "Become An Affiliate",
        content: "Become an affiliate content goes here.",
      },
    },

    endUserLicenseAgreement: {
      type: legalPageSchema,
      default: {
        title: "End User License Agreement",
        content: "End user license agreement content goes here.",
      },
    },

    disclaimer: {
      type: legalPageSchema,
      default: {
        title: "Disclaimer",
        content: "Disclaimer content goes here.",
      },
    },

    paymentTransferTerms: {
      type: legalPageSchema,
      default: {
        title: "Payment Transfer Terms and Conditions",
        content: "Payment transfer terms and conditions content goes here.",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);