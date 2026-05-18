const PlanSettings = require("../models/PlanSettings");

const getOrCreateSettings = async () => {
  let settings = await PlanSettings.findOne();

  if (!settings) {
    settings = await PlanSettings.create({});
  }

  return settings;
};

exports.getPlanSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch plan settings",
      error: error.message,
    });
  }
};

exports.updatePlanSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    if (req.body.mobileSection) {
      settings.set("mobileSection", req.body.mobileSection);
      settings.markModified("mobileSection");
    }

    if (req.body.businessSection) {
      settings.set("businessSection", req.body.businessSection);
      settings.markModified("businessSection");
    }

    if (req.body.memberSection) {
      settings.set("memberSection", req.body.memberSection);
      settings.markModified("memberSection");
    }

    await settings.save();

    const updatedSettings = await PlanSettings.findById(settings._id).lean();

    return res.status(200).json({
      success: true,
      message: "Plan settings updated successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update plan settings",
      error: error.message,
    });
  }
};