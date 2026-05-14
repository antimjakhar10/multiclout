const Mentor = require("../models/Mentor");

// Add mentor
exports.addMentor = async (req, res) => {
  try {
    const {
      name,
      role,
      bio,
      desc,
      videosCount,
      viewsCount,
      active,
      order,
    } = req.body;

    const finalBio = (bio || desc || "").trim();

    if (!name || !role) {
      return res.status(400).json({
        success: false,
        message: "Name and role are required",
      });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const mentor = await Mentor.create({
      name: name.trim(),
      role: role.trim(),
      bio: finalBio,
      desc: finalBio,
      image,
      videosCount: videosCount || "0",
      viewsCount: viewsCount || "0",
      active: active === "false" ? false : true,
      order: Number(order || 0),
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

    const normalizedMentors = mentors.map((mentor) => ({
      ...mentor.toObject(),
      bio: mentor.bio || mentor.desc || "",
    }));

    res.status(200).json({
      success: true,
      count: normalizedMentors.length,
      mentors: normalizedMentors,
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

    const normalizedMentors = mentors.map((mentor) => ({
      ...mentor.toObject(),
      bio: mentor.bio || mentor.desc || "",
    }));

    res.status(200).json({
      success: true,
      count: normalizedMentors.length,
      mentors: normalizedMentors,
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

    const normalizedMentor = {
      ...mentor.toObject(),
      bio: mentor.bio || mentor.desc || "",
    };

    res.status(200).json({
      success: true,
      mentor: normalizedMentor,
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
    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    const {
      name,
      role,
      bio,
      desc,
      videosCount,
      viewsCount,
      active,
      order,
    } = req.body;

    const finalBio =
      bio !== undefined || desc !== undefined
        ? (bio || desc || "").trim()
        : mentor.bio || mentor.desc || "";

    if (req.file) {
      mentor.image = `/uploads/${req.file.filename}`;
    }

    mentor.name = name !== undefined ? name.trim() : mentor.name;
    mentor.role = role !== undefined ? role.trim() : mentor.role;
    mentor.bio = finalBio;
    mentor.desc = finalBio;
    mentor.videosCount =
      videosCount !== undefined ? videosCount : mentor.videosCount;
    mentor.viewsCount =
      viewsCount !== undefined ? viewsCount : mentor.viewsCount;
    mentor.active = active === undefined ? mentor.active : active === "false" ? false : !!active;
    mentor.order = order !== undefined ? Number(order) : mentor.order;

    await mentor.save();

    res.status(200).json({
      success: true,
      message: "Mentor updated successfully",
      mentor,
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