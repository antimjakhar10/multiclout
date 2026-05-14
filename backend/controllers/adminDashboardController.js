const Course = require("../models/Course");
const Tutorial = require("../models/Tutorial");
const Mentor = require("../models/Mentor");
const Testimonial = require("../models/Testimonial");
const FAQ = require("../models/FAQ");
const Reason = require("../models/Reason");
const Video = require("../models/Video");

const getDashboardSummary = async (req, res) => {
  try {
    const [
      totalCourses,
      totalTutorials,
      totalMentors,
      totalTestimonials,
      totalFaqs,
      totalReasons,
      totalVideos,
    ] = await Promise.all([
      Course.countDocuments(),
      Tutorial.countDocuments(),
      Mentor.countDocuments(),
      Testimonial.countDocuments(),
      FAQ.countDocuments(),
      Reason.countDocuments(),
      Video.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalCourses,
        totalTutorials,
        totalMentors,
        totalTestimonials,
        totalFaqs,
        totalReasons,
        totalVideos,
      },
    });
  } catch (error) {
    console.error("Dashboard summary controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard summary",
      error: error.message,
    });
  }
};

module.exports = { getDashboardSummary };