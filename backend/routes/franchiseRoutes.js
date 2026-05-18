const express = require("express");
const router = express.Router();

const {
  getFranchiseData,
  saveFranchiseData,
  createFranchiseEnquiry,
  getFranchiseEnquiries,
  updateFranchiseEnquiryStatus,
  deleteFranchiseEnquiry,
} = require("../controllers/franchiseController");

const protectAdmin = require("../middleware/adminAuthMiddleware");

// public
router.get("/", getFranchiseData);
router.post("/enquiry", createFranchiseEnquiry);

// admin
router.post("/save", protectAdmin, saveFranchiseData);
router.get("/enquiries", protectAdmin, getFranchiseEnquiries);
router.put("/enquiries/:id", protectAdmin, updateFranchiseEnquiryStatus);
router.delete("/enquiries/:id", protectAdmin, deleteFranchiseEnquiry);

module.exports = router;