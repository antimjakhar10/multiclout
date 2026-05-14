const crypto = require("crypto");
const Razorpay = require("razorpay");
const Course = require("../models/Course");
const Order = require("../models/Order");
const PlanSettings = require("../models/PlanSettings");
const User = require("../models/User");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const parseAmount = (price = "") => {
  if (!price) return 0;
  const cleaned = String(price).replace(/[^\d.]/g, "");
  const amount = Number(cleaned);
  return Number.isFinite(amount) ? amount : 0;
};

const getPlanByKey = async (planKey) => {
  const settings = await PlanSettings.findOne();

  if (!settings?.mobileSection?.plans?.length) return null;

  return settings.mobileSection.plans.find(
    (plan) => plan.active && plan.key === planKey
  );
};

exports.createPaymentOrder = async (req, res) => {
  try {
    const { planKey } = req.body;

    if (!planKey) {
      return res.status(400).json({
        success: false,
        message: "Plan key is required",
      });
    }

    const plan = await getPlanByKey(planKey);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Selected plan not found",
      });
    }

    const amountInRupees = parseAmount(plan.price);

    if (!amountInRupees || amountInRupees < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan amount",
      });
    }

    const order = await razorpay.orders.create({
      amount: amountInRupees * 100,
      currency: "INR",
      receipt: `mc_${req.user._id}_${Date.now()}`,
      notes: {
        userId: String(req.user._id),
        planKey: plan.key,
      },
    });

    const user = await User.findById(req.user._id).select("-password");

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      planTitle: plan.title,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message,
    });
  }
};

exports.verifyPaymentAndActivatePlan = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      planKey,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !planKey ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Incomplete payment details",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      await User.findByIdAndUpdate(userId, {
        paymentStatus: "failed",
      });

      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
    }

    const plan = await getPlanByKey(planKey);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Selected plan not found",
      });
    }

    const amount = parseAmount(plan.price);
    const startDate = new Date();
    const endDate = new Date(startDate);

    let subscriptionStatus = "inactive";
    let subscriptionPlan = "none";

    if (planKey === "trial_monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
      subscriptionStatus = "trial";
      subscriptionPlan = "trial_monthly";
    } else if (planKey === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
      subscriptionStatus = "active";
      subscriptionPlan = "yearly";
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid plan selected",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        subscriptionStatus,
        subscriptionPlan,
        subscriptionAmount: amount,
        subscriptionStartDate: startDate,
        subscriptionEndDate: endDate,
        hasAcceptedTerms: true,
        onboardingCompleted: true,
        paymentStatus: "success",
      },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Payment verified and subscription activated",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.message,
    });
  }
};

exports.markPaymentFailed = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      paymentStatus: "failed",
    });

    return res.status(200).json({
      success: true,
      message: "Payment marked as failed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update payment status",
      error: error.message,
    });
  }
};

exports.createCoursePaymentOrder = async (req, res) => {
  try {
    const { items } = req.body;

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

    const totalAmount = courses.reduce(
      (sum, course) => sum + Number(course.price || 0),
      0
    );

    if (!totalAmount || totalAmount < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid course amount",
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `course_${req.user._id}_${Date.now()}`,
      notes: {
        userId: String(req.user._id),
        type: "course_purchase",
      },
    });

    const user = await User.findById(req.user._id).select("-password");

    return res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      totalAmount,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create course payment order",
      error: error.message,
    });
  }
};

exports.verifyCoursePaymentAndCreateOrder = async (req, res) => {
  try {
    const {
      items,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !items?.length ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Incomplete payment details",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
    }

    const courseIds = items.map((item) => item._id || item.course).filter(Boolean);

    const courses = await Course.find({
      _id: { $in: courseIds },
      active: true,
    });

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
      paymentMethod: "razorpay",
      paymentStatus: "success",
      orderStatus: "placed",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    return res.status(201).json({
      success: true,
      message: "Payment successful and order placed",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to verify course payment",
      error: error.message,
    });
  }
};