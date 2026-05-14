const Order = require("../models/Order");
const Course = require("../models/Course");

exports.createOrder = async (req, res) => {
  try {
    const { items, paymentMethod = "demo" } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const courseIds = items.map((item) => item._id || item.course).filter(Boolean);

    const courses = await Course.find({
      _id: { $in: courseIds },
      active: true,
    });

    if (!courses.length) {
      return res.status(404).json({
        success: false,
        message: "No valid courses found",
      });
    }

    const orderItems = courses.map((course) => ({
      course: course._id,
      title: course.title,
      image: course.image,
      instructor: course.instructor,
      price: Number(course.price || 0),
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      paymentMethod,
      paymentStatus: "success",
      orderStatus: "placed",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.course")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};