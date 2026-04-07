const Reel = require("../models/Reel");

// Add reel
exports.addReel = async (req, res) => {
  try {
    const {
      title,
      duration,
      category,
      thumbnail,
      videoUrl,
      description,
      active,
      order,
    } = req.body;

    if (!title || !duration || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, duration and category are required",
      });
    }

    const reel = await Reel.create({
      title,
      duration,
      category,
      thumbnail,
      videoUrl,
      description,
      active,
      order,
    });

    res.status(201).json({
      success: true,
      message: "Reel added successfully",
      reel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add reel",
      error: error.message,
    });
  }
};

// Get reels public
exports.getReels = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = { active: true };

    if (category && category !== "All Categories") {
      filter.category = category;
    }

    const reels = await Reel.find(filter).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reels.length,
      reels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reels",
      error: error.message,
    });
  }
};

// Admin all reels
exports.getAllReelsAdmin = async (req, res) => {
  try {
    const reels = await Reel.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reels.length,
      reels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all reels",
      error: error.message,
    });
  }
};

// Categories
exports.getReelCategories = async (req, res) => {
  try {
    const categories = await Reel.distinct("category", { active: true });

    res.status(200).json({
      success: true,
      categories: ["All Categories", ...categories],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reel categories",
      error: error.message,
    });
  }
};

// Get single reel
exports.getSingleReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);

    if (!reel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found",
      });
    }

    res.status(200).json({
      success: true,
      reel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reel",
      error: error.message,
    });
  }
};

// Update reel
exports.updateReel = async (req, res) => {
  try {
    const updatedReel = await Reel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedReel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reel updated successfully",
      reel: updatedReel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update reel",
      error: error.message,
    });
  }
};

// Delete reel
exports.deleteReel = async (req, res) => {
  try {
    const deletedReel = await Reel.findByIdAndDelete(req.params.id);

    if (!deletedReel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reel deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete reel",
      error: error.message,
    });
  }
};