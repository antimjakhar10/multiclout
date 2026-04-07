const FAQ = require("../models/FAQ");

exports.addFAQ = async (req, res) => {
  try {
    const { question, answer, active, order } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required",
      });
    }

    const faq = await FAQ.create({
      question,
      answer,
      active,
      order,
    });

    res.status(201).json({
      success: true,
      message: "FAQ added successfully",
      faq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add FAQ",
      error: error.message,
    });
  }
};

exports.getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ active: true }).sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: faqs.length,
      faqs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQs",
      error: error.message,
    });
  }
};

exports.getAllFAQsAdmin = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: faqs.length,
      faqs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all FAQs",
      error: error.message,
    });
  }
};

exports.getSingleFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.status(200).json({
      success: true,
      faq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQ",
      error: error.message,
    });
  }
};

exports.updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
      faq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update FAQ",
      error: error.message,
    });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete FAQ",
      error: error.message,
    });
  }
};