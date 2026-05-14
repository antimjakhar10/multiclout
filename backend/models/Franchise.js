const mongoose = require("mongoose");

const statSchema = new mongoose.Schema(
  {
    label: { type: String, default: "" },
    value: { type: String, default: "" },
  },
  { _id: false }
);

const cardSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const processSchema = new mongoose.Schema(
  {
    step: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, default: "" },
    answer: { type: String, default: "" },
  },
  { _id: false }
);

const franchiseSchema = new mongoose.Schema(
  {
    hero: {
      badge: { type: String, default: "" },
      title: { type: String, default: "" },
      subtitle: { type: String, default: "" },
      backgroundImage: { type: String, default: "" },
      stats: { type: [statSchema], default: [] },
    },

    enquirySection: {
      heading: { type: String, default: "" },
      title: { type: String, default: "" },
      subtitle: { type: String, default: "" },
    },

    whyFranchise: {
      heading: { type: String, default: "" },
      title: { type: String, default: "" },
      items: { type: [cardSchema], default: [] },
    },

    brandStats: {
      heading: { type: String, default: "" },
      title: { type: String, default: "" },
      image: { type: String, default: "" },
      stats: { type: [cardSchema], default: [] },
    },

    factsSection: {
  heading: { type: String, default: "" },
  backgroundImage: { type: String, default: "" },
  stats: { type: [statSchema], default: [] },
},

    founder: {
      heading: { type: String, default: "" },
      name: { type: String, default: "" },
      designation: { type: String, default: "" },
      message: { type: String, default: "" },
      image: { type: String, default: "" },
    },

    idealPartner: {
      heading: { type: String, default: "" },
      title: { type: String, default: "" },
      items: { type: [cardSchema], default: [] },
    },

    deliveryModes: {
      heading: { type: String, default: "" },
      title: { type: String, default: "" },
      items: { type: [cardSchema], default: [] },
    },

    supportSystem: {
      heading: { type: String, default: "" },
      title: { type: String, default: "" },
      items: { type: [cardSchema], default: [] },
    },

    processSection: {
      heading: { type: String, default: "" },
      title: { type: String, default: "" },
      items: { type: [processSchema], default: [] },
    },

    faqSection: {
      heading: { type: String, default: "" },
      title: { type: String, default: "" },
      items: { type: [faqSchema], default: [] },
    },

    videoSection: {
      heading: { type: String, default: "" },
      title: { type: String, default: "" },
      youtubeUrl: { type: String, default: "" },
      thumbnail: { type: String, default: "" },
    },

    logosSection: {
      heading: { type: String, default: "" },
      title: { type: String, default: "" },
      logos: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Franchise", franchiseSchema);