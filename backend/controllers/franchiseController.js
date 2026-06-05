const Franchise = require("../models/Franchise");
const FranchiseEnquiry = require("../models/FranchiseEnquiry");

const getBlankFranchiseData = () => ({
  hero: {
    badge: "",
    title: "",
    subtitle: "",
    backgroundImage: "",
    stats: [],
  },

  enquirySection: {
    heading: "",
    title: "",
    subtitle: "",
  },

  whyFranchise: {
    heading: "",
    title: "",
    items: [],
  },

  brandStats: {
    heading: "",
    title: "",
    image: "",
    stats: [],
  },

  franchiseBannerSection: {
  heading: "",
  title: "",
  subtitle: "",
  image: "",
},
  
  factsSection: {
  heading: "",
  backgroundImage: "",
  stats: [],
},

  founder: {
    heading: "",
    name: "",
    designation: "",
    message: "",
    image: "",
  },

  idealPartner: {
    heading: "",
    title: "",
    items: [],
  },

  deliveryModes: {
    heading: "",
    title: "",
    items: [],
  },

  supportSystem: {
    heading: "",
    title: "",
    items: [],
  },

  processSection: {
    heading: "",
    title: "",
    items: [],
  },

  faqSection: {
    heading: "",
    title: "",
    items: [],
  },

  videoSection: {
    heading: "",
    title: "",
    youtubeUrl: "",
    thumbnail: "",
  },

  logosSection: {
    heading: "",
    title: "",
    logos: [],
  },
});

const getFranchiseData = async (req, res) => {
  try {
    let data = await Franchise.findOne();

    if (!data) {
      data = await Franchise.create(getBlankFranchiseData());
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch franchise data",
      error: error.message,
    });
  }
};

const saveFranchiseData = async (req, res) => {
  try {
    let existing = await Franchise.findOne();

    if (existing) {
      existing = await Franchise.findByIdAndUpdate(existing._id, req.body, {
        new: true,
      });
    } else {
      existing = await Franchise.create(req.body);
    }

    res.status(200).json({
      success: true,
      message: "Franchise data saved successfully",
      data: existing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save franchise data",
      error: error.message,
    });
  }
};

const createFranchiseEnquiry = async (req, res) => {
  try {
    const {
  name,
  email,
  phone,
  city,
  state,
  investmentRange,
  message,
} = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email and phone are required",
      });
    }

    if (!investmentRange) {
      return res.status(400).json({
        success: false,
        message: "Investment range is required",
      });
    }

    const enquiry = await FranchiseEnquiry.create({
  name,
  email,
  phone,
  city,
  state,
  investmentRange,
  message,
});

    res.status(201).json({
      success: true,
      message: "Franchise enquiry submitted successfully",
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit franchise enquiry",
      error: error.message,
    });
  }
};

const getFranchiseEnquiries = async (req, res) => {
  try {
    const enquiries = await FranchiseEnquiry.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: enquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch franchise enquiries",
      error: error.message,
    });
  }
};

const updateFranchiseEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await FranchiseEnquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry status updated",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update enquiry",
      error: error.message,
    });
  }
};

const deleteFranchiseEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await FranchiseEnquiry.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete enquiry",
      error: error.message,
    });
  }
};

module.exports = {
  getFranchiseData,
  saveFranchiseData,
  createFranchiseEnquiry,
  getFranchiseEnquiries,
  updateFranchiseEnquiryStatus,
  deleteFranchiseEnquiry,
};