const express = require("express");
const router = express.Router();

const {
  getSiteSettings,
  updateSiteSettings,
  submitContactEnquiry,
  getAllContactEnquiries,
  updateContactEnquiryStatus,
  deleteContactEnquiry,
} = require("../controllers/siteSettingsController");

const { protectAdmin } = require("../middleware/authMiddleware");

// PUBLIC
router.get("/", getSiteSettings);
router.post("/contact-enquiry", submitContactEnquiry);

// ADMIN
router.put("/update", protectAdmin, updateSiteSettings);
router.get("/contact-enquiries", protectAdmin, getAllContactEnquiries);
router.put("/contact-enquiries/:id", protectAdmin, updateContactEnquiryStatus);
router.delete("/contact-enquiries/:id", protectAdmin, deleteContactEnquiry);

module.exports = router;