const crypto = require("crypto");
const Razorpay = require("razorpay");

const Course = require("../models/Course");
const Order = require("../models/Order");
const PlanSettings = require("../models/PlanSettings");
const User = require("../models/User");

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys are missing in backend env");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const parseAmount = (price = "") => {
  if (price === null || price === undefined) return 0;

  const cleaned = String(price).replace(/[^\d.]/g, "");
  const amount = Number(cleaned);

  return Number.isFinite(amount) ? amount : 0;
};

const verifySignature = ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  return generatedSignature === razorpay_signature;
};

const getPlanByKey = async (planKey) => {
  const settings = await PlanSettings.findOne();

  if (!settings) return null;

  const sections = [
    {
      sectionKey: "mobile",
      sectionName: "mobileSection",
      plans: settings.mobileSection?.plans || [],
    },
    {
      sectionKey: "business",
      sectionName: "businessSection",
      plans: settings.businessSection?.plans || [],
    },
    {
      sectionKey: "member",
      sectionName: "memberSection",
      plans: settings.memberSection?.plans || [],
    },
  ];

  for (const section of sections) {
    const plan = section.plans.find(
      (item) => item.active && item.key === planKey
    );

    if (plan) {
      return {
        plan,
        sectionKey: section.sectionKey,
        sectionName: section.sectionName,
      };
    }
  }

  return null;
};

exports.createPaymentOrder = async (req, res) => {
  try {
    const { planKey } = req.body;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay keys are missing in backend env",
      });
    }

    if (!planKey) {
      return res.status(400).json({
        success: false,
        message: "Plan key is required",
      });
    }

    const planResult = await getPlanByKey(planKey);

    if (!planResult) {
      return res.status(404).json({
        success: false,
        message: "Selected plan not found",
      });
    }

    const { plan, sectionKey } = planResult;
    const amountInRupees = parseAmount(plan.price);

    if (!amountInRupees || amountInRupees < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan amount",
      });
    }

    const order = await getRazorpayInstance().orders.create({
      amount: Math.round(amountInRupees * 100),
      currency: "INR",
      receipt: `mc_plan_${req.user._id}_${Date.now()}`.slice(0, 40),
      notes: {
        userId: String(req.user._id),
        planKey: plan.key,
        sectionKey,
        type: "plan_purchase",
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
      planKey: plan.key,
      sectionKey,
      user,
    });
  } catch (error) {
    console.error("createPaymentOrder error:", error);

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

    const isValidSignature = verifySignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValidSignature) {
      await User.findByIdAndUpdate(userId, {
        paymentStatus: "failed",
      });

      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
    }

    const planResult = await getPlanByKey(planKey);

    if (!planResult) {
      return res.status(404).json({
        success: false,
        message: "Selected plan not found",
      });
    }

    const { plan, sectionKey } = planResult;
    const amount = parseAmount(plan.price);

    const startDate = new Date();
    const endDate = new Date(startDate);

    let updateData = {
      paymentStatus: "success",
      hasAcceptedTerms: true,
      onboardingCompleted: true,
    };

    if (sectionKey === "mobile") {
      if (planKey === "trial_monthly") {
        endDate.setMonth(endDate.getMonth() + 1);

        updateData = {
          ...updateData,
          subscriptionStatus: "trial",
          subscriptionPlan: "trial_monthly",
          subscriptionAmount: amount,
          subscriptionStartDate: startDate,
          subscriptionEndDate: endDate,
        };
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);

        updateData = {
          ...updateData,
          subscriptionStatus: "active",
          subscriptionPlan: planKey,
          subscriptionAmount: amount,
          subscriptionStartDate: startDate,
          subscriptionEndDate: endDate,
        };
      }
    }

    if (sectionKey === "business" || sectionKey === "member") {
      endDate.setFullYear(endDate.getFullYear() + 1);

      updateData = {
        ...updateData,
        businessMembershipStatus: "active",
        businessMembershipPlan: planKey,
        businessMembershipAmount: amount,
        businessMembershipStartDate: startDate,
        businessMembershipEndDate: endDate,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      user: updatedUser,
      sectionKey,
      planKey,
    });
  } catch (error) {
    console.error("verifyPaymentAndActivatePlan error:", error);

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
    console.error("markPaymentFailed error:", error);

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

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay keys are missing in backend env",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const courseIds = items
      .map((item) => item._id || item.course)
      .filter(Boolean);

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

    const razorpayOrder = await getRazorpayInstance().orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `mc_course_${req.user._id}_${Date.now()}`.slice(0, 40),
      notes: {
        userId: String(req.user._id),
        type: "course_purchase",
      },
    });

    const user = await User.findById(req.user._id).select("-password");

    return res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
      user,
    });
  } catch (error) {
    console.error("createCoursePaymentOrder error:", error);

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
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Incomplete course payment details",
      });
    }

    const isValidSignature = verifySignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValidSignature) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
    }

    const courseIds = items
      .map((item) => item._id || item.course)
      .filter(Boolean);

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

    const alreadyExists = await Order.findOne({
      user: req.user._id,
      razorpayOrderId: razorpay_order_id,
    });

    if (alreadyExists) {
      return res.status(200).json({
        success: true,
        message: "Order already created",
        order: alreadyExists,
      });
    }

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
      message: "Course payment verified and order created",
      order,
    });
  } catch (error) {
    console.error("verifyCoursePaymentAndCreateOrder error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify course payment",
      error: error.message,
    });
  }
};

exports.createVideoSubscription = async (req, res) => {
  try {
    const { planKey } = req.body;

    const planResult = await getPlanByKey(planKey);

    if (!planResult || planResult.sectionKey !== "mobile") {
      return res.status(404).json({
        success: false,
        message: "Video subscription plan not found",
      });
    }

    const { plan } = planResult;

    if (!plan.razorpayPlanId) {
      return res.status(400).json({
        success: false,
        message: "Razorpay Plan ID missing for this plan",
      });
    }

    const trialAmount = parseAmount(plan.trialPrice || plan.price || 1);
    const trialDays = Number(plan.trialDays || 30);

    const startAt = Math.floor(
      (Date.now() + trialDays * 24 * 60 * 60 * 1000) / 1000
    );

    const subscription = await getRazorpayInstance().subscriptions.create({
      plan_id: plan.razorpayPlanId,
      total_count: plan.billingCycle === "yearly" ? 10 : 120,
      quantity: 1,
      customer_notify: 1,
      start_at: startAt,
      addons: [
        {
          item: {
            name: `${plan.title} - First Month Trial`,
            amount: Math.round(trialAmount * 100),
            currency: "INR",
          },
        },
      ],
      notes: {
        userId: String(req.user._id),
        planKey: plan.key,
        billingCycle: plan.billingCycle,
      },
    });

    const user = await User.findById(req.user._id).select("-password");

    return res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      subscriptionId: subscription.id,
      planTitle: plan.title,
      planKey: plan.key,
      user,
    });
  } catch (error) {
    console.error("createVideoSubscription error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create video subscription",
      error: error.message,
    });
  }
};

exports.verifyVideoSubscription = async (req, res) => {
  try {
    const {
      planKey,
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Subscription signature verification failed",
      });
    }

    const planResult = await getPlanByKey(planKey);

    if (!planResult || planResult.sectionKey !== "mobile") {
      return res.status(404).json({
        success: false,
        message: "Video subscription plan not found",
      });
    }

    const { plan } = planResult;

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Number(plan.trialDays || 30));

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        paymentStatus: "success",
        hasAcceptedTerms: true,
        onboardingCompleted: true,

        subscriptionStatus: "trial",
        subscriptionPlan: plan.key,
        subscriptionAmount: parseAmount(plan.trialPrice || plan.price || 1),
        subscriptionStartDate: startDate,
        subscriptionEndDate: endDate,

        razorpaySubscriptionId: razorpay_subscription_id,
        razorpayPlanId: plan.razorpayPlanId,
        subscriptionBillingCycle: plan.billingCycle || "none",
        subscriptionAutoPay: !!plan.autopayEnabled,
        subscriptionCancelledAt: null,
      },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Subscription activated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("verifyVideoSubscription error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify video subscription",
      error: error.message,
    });
  }
};