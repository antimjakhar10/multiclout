const Course = require("../models/Course");

// Add course (admin)
exports.addCourse = async (req, res) => {
  try {
    const {
      title,
      instructor,
      rating,
      learners,
      tag,
      price,
      oldPrice,
      category,
      image,
      description,
      active,
      order,
    } = req.body;

    if (!title || !instructor || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, instructor, price and category are required",
      });
    }

    const course = await Course.create({
      title,
      instructor,
      rating,
      learners,
      tag,
      price,
      oldPrice,
      category,
      image,
      description,
      active,
      order,
    });

    res.status(201).json({
      success: true,
      message: "Course added successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add course",
      error: error.message,
    });
  }
};

// Get all active courses (public)
exports.getCourses = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = { active: true };

    if (category) {
      filter.category = category;
    }

    const courses = await Course.find(filter).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

// Get all courses for admin
exports.getAllCoursesAdmin = async (req, res) => {
  try {
    const courses = await Course.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all courses",
      error: error.message,
    });
  }
};

// Get categories
exports.getCourseCategories = async (req, res) => {
  try {
    const categories = await Course.distinct("category", { active: true });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// Get single course
exports.getSingleCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      error: error.message,
    });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);

    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};