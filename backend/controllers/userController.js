const User = require("../models/User");

exports.getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

exports.deleteUserAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, phone, bio } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required",
      });
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      return res.status(400).json({
        success: false,
        message: "Valid 10-digit phone number is required",
      });
    }

    const trimmedEmail = email ? email.toLowerCase().trim() : "";
    const trimmedPhone = phone.trim();

    const existingPhoneUser = await User.findOne({
      phone: trimmedPhone,
      _id: { $ne: userId },
    });

    if (existingPhoneUser) {
      return res.status(400).json({
        success: false,
        message: "This mobile number is already in use",
      });
    }

    if (trimmedEmail) {
      const existingEmailUser = await User.findOne({
        email: trimmedEmail,
        _id: { $ne: userId },
      });

      if (existingEmailUser) {
        return res.status(400).json({
          success: false,
          message: "This email is already in use",
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name.trim(),
        email: trimmedEmail,
        phone: trimmedPhone,
        bio: bio ? bio.trim() : "",
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

exports.completeOnboarding = async (req, res) => {
  try {
    const userId = req.user._id;
    const { acceptedTerms } = req.body;

    if (!acceptedTerms) {
      return res.status(400).json({
        success: false,
        message: "Terms acceptance is required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        hasAcceptedTerms: true,
        onboardingCompleted: true,
        paymentStatus: "skipped",
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Onboarding completed",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to complete onboarding",
      error: error.message,
    });
  }
};

exports.activateSubscriptionPlan = async (req, res) => {
  try {
    const userId = req.user._id;
    const { plan } = req.body;

    const today = new Date();
    let endDate = new Date();

    let planValue = "none";
    let amount = 0;
    let status = "inactive";

    if (plan === "trial_monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
      planValue = "trial_monthly";
      amount = 1;
      status = "trial";
    } else if (plan === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
      planValue = "yearly";
      amount = 149;
      status = "active";
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid plan selected",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        subscriptionStatus: status,
        subscriptionPlan: planValue,
        subscriptionAmount: amount,
        subscriptionStartDate: today,
        subscriptionEndDate: endDate,
        onboardingCompleted: true,
        hasAcceptedTerms: true,
        paymentStatus: "success",
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Subscription activated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to activate subscription",
      error: error.message,
    });
  }
};

exports.deleteMyAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Your account has been deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
      error: error.message,
    });
  }
};