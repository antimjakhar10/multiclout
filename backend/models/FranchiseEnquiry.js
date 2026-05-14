const mongoose = require("mongoose");

const franchiseEnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, default: "", trim: true },
    investmentRange: {
      type: String,
      enum: ["1-2 Lakh", "2-3 Lakh", "3-4 Lakh", "4-5 Lakh"],
      default: "",
      trim: true,
    },
    message: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FranchiseEnquiry", franchiseEnquirySchema);