const Stat = require("../models/Stat");

exports.addStat = async (req, res) => {
  try {
    const { value, label, active, order } = req.body;

    if (!value || !label) {
      return res.status(400).json({
        success: false,
        message: "Value and label are required",
      });
    }

    const stat = await Stat.create({
      value,
      label,
      active,
      order,
    });

    res.status(201).json({
      success: true,
      message: "Stat added successfully",
      stat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add stat",
      error: error.message,
    });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await Stat.find({ active: true }).sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: stats.length,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
      error: error.message,
    });
  }
};

exports.getAllStatsAdmin = async (req, res) => {
  try {
    const stats = await Stat.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: stats.length,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all stats",
      error: error.message,
    });
  }
};

exports.updateStat = async (req, res) => {
  try {
    const stat = await Stat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!stat) {
      return res.status(404).json({
        success: false,
        message: "Stat not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Stat updated successfully",
      stat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update stat",
      error: error.message,
    });
  }
};

exports.deleteStat = async (req, res) => {
  try {
    const stat = await Stat.findByIdAndDelete(req.params.id);

    if (!stat) {
      return res.status(404).json({
        success: false,
        message: "Stat not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Stat deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete stat",
      error: error.message,
    });
  }
};