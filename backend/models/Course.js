const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    duration: {
      type: String,
      trim: true,
      default: "",
    },
    type: {
      type: String,
      trim: true,
      default: "video",
    },
    videoUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    lecturesCount: {
      type: String,
      trim: true,
      default: "",
    },
    duration: {
      type: String,
      trim: true,
      default: "",
    },
    lessons: {
      type: [lessonSchema],
      default: [],
    },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      index: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    instructor: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    learners: {
      type: Number,
      default: 0,
    },
    tag: {
      type: String,
      trim: true,
      default: "",
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: true,
    },
    oldPrice: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subcategory: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    previewVideo: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    fullDescription: {
      type: String,
      default: "",
      trim: true,
    },
    language: {
      type: String,
      trim: true,
      default: "English",
    },
    lastUpdatedText: {
      type: String,
      trim: true,
      default: "",
    },
    duration: {
      type: String,
      trim: true,
      default: "",
    },
    level: {
      type: String,
      trim: true,
      default: "All Levels",
    },
    offerText: {
      type: String,
      trim: true,
      default: "",
    },
    moneyBackDays: {
      type: Number,
      default: 30,
    },
    whatYouWillLearn: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    includes: {
      type: [String],
      default: [],
    },
    outcomes: {
      type: [String],
      default: [],
    },
    sections: {
      type: [sectionSchema],
      default: [],
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
    active: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);