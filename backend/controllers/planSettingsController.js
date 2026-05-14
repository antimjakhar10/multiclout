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
      settings.mobileSection = req.body.mobileSection;
    }

    if (req.body.businessSection) {
      settings.businessSection = req.body.businessSection;
    }

    if (req.body.memberSection) {
  settings.memberSection = req.body.memberSection;
}

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Plan settings updated successfully",
      settings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update plan settings",
      error: error.message,
    });
  }
};