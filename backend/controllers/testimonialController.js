const Testimonial = require("../models/Testimonial");

exports.addTestimonial = async (req, res) => {
  try {
    const { name, city, text, rating, active, order } = req.body;

    if (!name || !text) {
      return res.status(400).json({
        success: false,
        message: "Name and text are required",
      });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const testimonial = await Testimonial.create({
      name: name.trim(),
      city: (city || "").trim(),
      text: text.trim(),
      rating: Number(rating || 5),
      image,
      active: active === "false" ? false : true,
      order: Number(order || 0),
    });

    res.status(201).json({
      success: true,
      message: "Testimonial added successfully",
      testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add testimonial",
      error: error.message,
    });
  }
};

exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ active: true }).sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch testimonials",
      error: error.message,
    });
  }
};

exports.getAllTestimonialsAdmin = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all testimonials",
      error: error.message,
    });
  }
};

exports.getSingleTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch testimonial",
      error: error.message,
    });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    const { name, city, text, rating, active, order } = req.body;

    if (req.file) {
      testimonial.image = `/uploads/${req.file.filename}`;
    }

    testimonial.name = name !== undefined ? name.trim() : testimonial.name;
    testimonial.city = city !== undefined ? city.trim() : testimonial.city;
    testimonial.text = text !== undefined ? text.trim() : testimonial.text;
    testimonial.rating =
      rating !== undefined ? Number(rating) : testimonial.rating;
    testimonial.active =
      active === undefined ? testimonial.active : active === "false" ? false : true;
    testimonial.order =
      order !== undefined ? Number(order) : testimonial.order;

    await testimonial.save();

    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update testimonial",
      error: error.message,
    });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete testimonial",
      error: error.message,
    });
  }
};