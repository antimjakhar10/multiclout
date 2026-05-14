const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },
seoTitle: {
  type: String,
  trim: true,
  default: "",
},
seoDescription: {
  type: String,
  trim: true,
  default: "",
},
seoKeywords: {
  type: String,
  trim: true,
  default: "",
},
    category: {
      type: String,
      required: true,
      trim: true,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    videoFile: {
      type: String,
      default: "",
    },

    videoUrl: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      default: "2 mins",
    },

    views: { type: String, default: "0" },
    likes: { type: String, default: "0" },
    shares: { type: String, default: "0" },

    rating: {
      type: Number,
      default: 4.5,
    },

    accessType: {
      type: String,
      enum: ["free", "subscriber"],
      default: "free",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    topPick: {
      type: Boolean,
      default: false,
    },

    active: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},

uploadedByRole: {
  type: String,
  enum: ["admin", "user"],
  default: "admin",
},

approvalStatus: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "approved",
},

rejectionReason: {
  type: String,
  default: "",
},

approvedAt: {
  type: Date,
  default: null,
},

approvedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Admin",
  default: null,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);