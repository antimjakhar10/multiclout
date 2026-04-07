const Mentor = require("../models/Mentor");

// Add mentor
exports.addMentor = async (req, res) => {
  try {
    const { name, role, desc, image, active, order } = req.body;

    if (!name || !role || !desc) {
      return res.status(400).json({
        success: false,
        message: "Name, role and description are required",
      });
    }

    const mentor = await Mentor.create({
      name,
      role,
      desc,
      image,
      active,
      order,
    });

    res.status(201).json({
      success: true,
      message: "Mentor added successfully",
      mentor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add mentor",
      error: error.message,
    });
  }
};

// Get active mentors
exports.getMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({ active: true }).sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: mentors.length,
      mentors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch mentors",
      error: error.message,
    });
  }
};

// Get all mentors for admin
exports.getAllMentorsAdmin = async (req, res) => {
  try {
    const mentors = await Mentor.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: mentors.length,
      mentors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all mentors",
      error: error.message,
    });
  }
};

// Get single mentor
exports.getSingleMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    res.status(200).json({
      success: true,
      mentor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch mentor",
      error: error.message,
    });
  }
};

// Update mentor
exports.updateMentor = async (req, res) => {
  try {
    const updatedMentor = await Mentor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedMentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Mentor updated successfully",
      mentor: updatedMentor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update mentor",
      error: error.message,
    });
  }
};

// Delete mentor
exports.deleteMentor = async (req, res) => {
  try {
    const deletedMentor = await Mentor.findByIdAndDelete(req.params.id);

    if (!deletedMentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Mentor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete mentor",
      error: error.message,
    });
  }
};