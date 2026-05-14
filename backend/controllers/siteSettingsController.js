const SiteSettings = require("../models/SiteSettings");
const ContactEnquiry = require("../models/ContactEnquiry");

const getOrCreateSettings = async () => {
  let settings = await SiteSettings.findOne();

  if (!settings) {
    settings = await SiteSettings.create({});
  }

  let shouldSave = false;

  if (!settings.privacyPolicy || !settings.privacyPolicy.title) {
    settings.privacyPolicy = {
      title: "Privacy Policy",
      content: "",
    };
    shouldSave = true;
  }

  if (!settings.refundPolicy || !settings.refundPolicy.title) {
    settings.refundPolicy = {
      title: "Refund Policy",
      content: "",
    };
    shouldSave = true;
  }

  if (shouldSave) {
    await settings.save();
  }

  return settings;
};

// PUBLIC - GET SITE SETTINGS
const getSiteSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("getSiteSettings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch site settings",
    });
  }
};

// ADMIN - UPDATE SITE SETTINGS
const updateSiteSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    const updatedSettings = await SiteSettings.findByIdAndUpdate(
      settings._id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Site settings updated successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    console.error("updateSiteSettings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update site settings",
    });
  }
};

// PUBLIC - SUBMIT CONTACT ENQUIRY
const submitContactEnquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required.",
      });
    }

    const enquiry = await ContactEnquiry.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      enquiry,
    });
  } catch (error) {
    console.error("submitContactEnquiry error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry",
    });
  }
};

// ADMIN - GET ALL CONTACT ENQUIRIES
const getAllContactEnquiries = async (req, res) => {
  try {
    const enquiries = await ContactEnquiry.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      enquiries,
    });
  } catch (error) {
    console.error("getAllContactEnquiries error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact enquiries",
    });
  }
};

// ADMIN - UPDATE CONTACT ENQUIRY STATUS
const updateContactEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["new", "contacted", "closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const enquiry = await ContactEnquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry status updated successfully",
      enquiry,
    });
  } catch (error) {
    console.error("updateContactEnquiryStatus error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update enquiry status",
    });
  }
};

// ADMIN - DELETE CONTACT ENQUIRY
const deleteContactEnquiry = async (req, res) => {
  try {
    const enquiry = await ContactEnquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
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
    console.error("deleteContactEnquiry error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete enquiry",
    });
  }
};

module.exports = {
  getSiteSettings,
  updateSiteSettings,
  submitContactEnquiry,
  getAllContactEnquiries,
  updateContactEnquiryStatus,
  deleteContactEnquiry,
};