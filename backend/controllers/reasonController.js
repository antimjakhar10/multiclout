const Reason = require("../models/Reason");

exports.addReason = async (req, res) => {
  try {
    const { title, desc, icon, active, order } = req.body;

    if (!title || !desc) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const reason = await Reason.create({
      title,
      desc,
      icon,
      active,
      order,
    });

    res.status(201).json({
      success: true,
      message: "Reason added successfully",
      reason,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add reason",
      error: error.message,
    });
  }
};

exports.getReasons = async (req, res) => {
  try {
    const reasons = await Reason.find({ active: true }).sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: reasons.length,
      reasons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reasons",
      error: error.message,
    });
  }
};

exports.getAllReasonsAdmin = async (req, res) => {
  try {
    const reasons = await Reason.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: reasons.length,
      reasons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all reasons",
      error: error.message,
    });
  }
};

exports.updateReason = async (req, res) => {
  try {
    const reason = await Reason.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!reason) {
      return res.status(404).json({
        success: false,
        message: "Reason not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reason updated successfully",
      reason,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update reason",
      error: error.message,
    });
  }
};

exports.deleteReason = async (req, res) => {
  try {
    const reason = await Reason.findByIdAndDelete(req.params.id);

    if (!reason) {
      return res.status(404).json({
        success: false,
        message: "Reason not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reason deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete reason",
      error: error.message,
    });
  }
};