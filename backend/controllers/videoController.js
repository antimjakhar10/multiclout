const Video = require("../models/Video");
const {
  compressVideo,
  getPublicUploadPath,
} = require("../utils/compressHelper");

const makeSlug = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const normalizeCategorySlug = (value = "") =>
  value.toLowerCase().trim().replace(/\s+/g, "-");

const parseStoredCount = (value = 0) => {
  if (value === null || value === undefined || value === "") return 0;

  const raw = String(value).trim().toLowerCase().replace(/,/g, "");

  const match = raw.match(/^(\d+(\.\d+)?)([km])?(\+)?$/);
  if (match) {
    let num = Number(match[1]);
    const suffix = match[3];

    if (suffix === "k") num *= 1000;
    if (suffix === "m") num *= 1000000;

    return Math.floor(num);
  }

  const numeric = Number(raw);
  return Number.isNaN(numeric) ? 0 : Math.floor(numeric);
};

const countToStorageString = (value = 0) =>
  String(Math.max(0, Math.floor(value)));

const hasSubscriberAccess = (user) => {
  if (!user) return false;

  if (!["trial", "active"].includes(user.subscriptionStatus)) return false;

  if (!user.subscriptionEndDate) return false;

  return new Date(user.subscriptionEndDate) > new Date();
};

const serializeVideoForList = (video, user = null) => {
  const isSubscriberOnly = video.accessType === "subscriber";
  const canWatch = !isSubscriberOnly || hasSubscriberAccess(user);

  return {
    ...video.toObject(),
    isLocked: isSubscriberOnly && !canWatch,
    canWatch,
    lockedReason:
      isSubscriberOnly && !canWatch
        ? user
          ? "subscription_required"
          : "login_required"
        : "",
  };
};

const serializeVideoForDetail = (video, user = null) => {
  const base = serializeVideoForList(video, user);

  if (!base.canWatch) {
    base.videoFile = "";
    base.videoUrl = "";
  }

  return base;
};

const publicApprovedFilter = {
  active: true,
  $or: [
    { approvalStatus: "approved" },
    { approvalStatus: { $exists: false } },
    { approvalStatus: "" },
    { approvalStatus: null },
  ],
};

const getWatchPageData = async (req, res) => {
  try {
    const videos = await Video.find(publicApprovedFilter).sort({
      order: 1,
      createdAt: -1,
    });

    const serializedVideos = videos.map((video) =>
      serializeVideoForList(video, req.user),
    );

    const topPicks = serializedVideos
  .filter((v) => v.topPick === true)
  .sort((a, b) => {
    const orderA = Number(a.order ?? 0);
    const orderB = Number(b.order ?? 0);

    if (orderA !== orderB) return orderA - orderB;

    return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
  });

    const grouped = {};
    serializedVideos.forEach((video) => {
      const key = video.category?.trim() || "Other";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(video);
    });

    const categories = Object.keys(grouped).map((name) => ({
      name,
      slug: normalizeCategorySlug(name),
      count: grouped[name].length,
    }));

    const sections = Object.keys(grouped).map((name) => ({
      title: name,
      slug: normalizeCategorySlug(name),
      videos: grouped[name].slice(0, 12),
      total: grouped[name].length,
    }));

    res.json({
      success: true,
      topPicks,
      categories,
      sections,
    });
  } catch (error) {
    console.error("getWatchPageData error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch watch page data",
    });
  }
};


const getVideoBySlug = async (req, res) => {
  try {
    const video = await Video.findOne({
  slug: req.params.slug,
  ...publicApprovedFilter,
});

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const relatedVideos = await Video.find({
      ...publicApprovedFilter,
      category: video.category,
      _id: { $ne: video._id },
    })
      .sort({ order: 1, createdAt: -1 })
      .limit(8);

    res.json({
      success: true,
      video: serializeVideoForDetail(video, req.user),
      relatedVideos: relatedVideos.map((item) =>
        serializeVideoForList(item, req.user),
      ),
    });
  } catch (error) {
    console.error("getVideoBySlug error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch video",
    });
  }
};

const getVideosByCategory = async (req, res) => {
  try {
    const slug = req.params.slug;

    const videos = await Video.find(publicApprovedFilter).sort({
      order: 1,
      createdAt: -1,
    });

    const filtered = videos.filter(
      (item) => normalizeCategorySlug(item.category) === slug,
    );

    if (!filtered.length) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      categoryName: filtered[0].category,
      videos: filtered.map((item) => serializeVideoForList(item, req.user)),
    });
  } catch (error) {
    console.error("getVideosByCategory error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch category videos",
    });
  }
};

const getAdminVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, videos });
  } catch (error) {
    console.error("getAdminVideos error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch admin videos" });
  }
};

const createVideo = async (req, res) => {
  try {
    const {
      title,
      description,
      seoTitle,
      seoDescription,
      seoKeywords,
      category,
      videoUrl,
      duration,
      views,
      likes,
      shares,
      rating,
      accessType,
      featured,
      topPick,
      active,
      order,
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Title and category are required",
      });
    }

    const thumbnail = req.files?.thumbnail?.[0]
      ? `/uploads/${req.files.thumbnail[0].filename}`
      : "";

    let videoFile = "";

    if (req.files?.videoFile?.[0]) {
      const inputPath = req.files.videoFile[0].path;
      const compressedPath = await compressVideo(inputPath);
      videoFile = getPublicUploadPath(compressedPath);
    }

    if (!thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail is required",
      });
    }

    const baseSlug = makeSlug(title);
    let finalSlug = baseSlug;
    let count = 1;

    while (await Video.findOne({ slug: finalSlug })) {
      finalSlug = `${baseSlug}-${count}`;
      count++;
    }

    const newVideo = await Video.create({
      title,
      slug: finalSlug,
      description,
      seoTitle: seoTitle || "",
      seoDescription: seoDescription || "",
      seoKeywords: seoKeywords || "",
      category,
      thumbnail,
      videoFile,
      videoUrl,
      duration,
      views: views || "0",
      likes: likes || "0",
      shares: shares || "0",
      rating: Number(rating || 4.5),
      accessType: accessType === "subscriber" ? "subscriber" : "free",
      featured: featured === "true" || featured === true,
      topPick: topPick === "true" || topPick === true,
      active: active === "false" ? false : true,
      order: Number(order || 0),
      uploadedByRole: "admin",
      approvalStatus: "approved",
      approvedAt: new Date(),
      approvedBy: req.admin?._id || null,
    });

    res.status(201).json({
      success: true,
      message: "Video added successfully",
      video: newVideo,
    });
  } catch (error) {
    console.error("createVideo error:", error);
    res.status(500).json({ success: false, message: "Failed to add video" });
  }
};

const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    const {
      title,
      description,
      seoTitle,
      seoDescription,
      seoKeywords,
      category,
      videoUrl,
      duration,
      views,
      likes,
      shares,
      rating,
      accessType,
      featured,
      topPick,
      active,
      order,
    } = req.body;

    if (title && title !== video.title) {
      const baseSlug = makeSlug(title);
      let finalSlug = baseSlug;
      let count = 1;

      while (
        await Video.findOne({ slug: finalSlug, _id: { $ne: video._id } })
      ) {
        finalSlug = `${baseSlug}-${count}`;
        count++;
      }

      video.slug = finalSlug;
    }

    if (req.files?.thumbnail?.[0]) {
      video.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
    }

    if (req.files?.videoFile?.[0]) {
      const inputPath = req.files.videoFile[0].path;
      const compressedPath = await compressVideo(inputPath);
      video.videoFile = getPublicUploadPath(compressedPath);
    }

    video.title = title ?? video.title;
    video.description = description ?? video.description;
    video.seoTitle = seoTitle ?? video.seoTitle;
    video.seoDescription = seoDescription ?? video.seoDescription;
    video.seoKeywords = seoKeywords ?? video.seoKeywords;
    video.category = category ?? video.category;
    video.videoUrl = videoUrl ?? video.videoUrl;
    video.duration = duration ?? video.duration;
    video.views = views ?? video.views;
    video.likes = likes ?? video.likes;
    video.shares = shares ?? video.shares;
    video.rating = rating !== undefined ? Number(rating) : video.rating;
    video.accessType = accessType === "subscriber" ? "subscriber" : "free";
    video.featured = featured === "true" || featured === true;
    video.topPick = topPick === "true" || topPick === true;
    video.active = active === "false" ? false : true;
    video.order = order !== undefined ? Number(order) : video.order;

    await video.save();

    res.json({
      success: true,
      message: "Video updated successfully",
      video,
    });
  } catch (error) {
    console.error("updateVideo error:", error);
    res.status(500).json({ success: false, message: "Failed to update video" });
  }
};

const incrementVideoView = async (req, res) => {
  try {
    const video = await Video.findOne({
  slug: req.params.slug,
  ...publicApprovedFilter,
});
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    const currentViews = parseStoredCount(video.views);
    video.views = countToStorageString(currentViews + 1);
    await video.save();

    res.json({
      success: true,
      views: video.views,
      likes: video.likes,
      shares: video.shares,
    });
  } catch (error) {
    console.error("incrementVideoView error:", error);
    res.status(500).json({ success: false, message: "Failed to update views" });
  }
};

const incrementVideoLike = async (req, res) => {
  try {
    const video = await Video.findOne({
  slug: req.params.slug,
  ...publicApprovedFilter,
});
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    const currentLikes = parseStoredCount(video.likes);
    video.likes = countToStorageString(currentLikes + 1);
    await video.save();

    res.json({
      success: true,
      views: video.views,
      likes: video.likes,
      shares: video.shares,
    });
  } catch (error) {
    console.error("incrementVideoLike error:", error);
    res.status(500).json({ success: false, message: "Failed to update likes" });
  }
};

const incrementVideoShare = async (req, res) => {
  try {
    const video = await Video.findOne({
  slug: req.params.slug,
  ...publicApprovedFilter,
});
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    const currentShares = parseStoredCount(video.shares);
    video.shares = countToStorageString(currentShares + 1);
    await video.save();

    res.json({
      success: true,
      views: video.views,
      likes: video.likes,
      shares: video.shares,
    });
  } catch (error) {
    console.error("incrementVideoShare error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update shares" });
  }
};

const userUploadVideo = async (req, res) => {
  try {
    const { title, description, category, videoUrl, duration } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Title and category are required",
      });
    }

    const thumbnail = req.files?.thumbnail?.[0]
      ? `/uploads/${req.files.thumbnail[0].filename}`
      : "";

    let videoFile = "";

    if (req.files?.videoFile?.[0]) {
      const inputPath = req.files.videoFile[0].path;
      const compressedPath = await compressVideo(inputPath);
      videoFile = getPublicUploadPath(compressedPath);
    }

    if (!thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail is required",
      });
    }

    if (!videoFile && !videoUrl) {
      return res.status(400).json({
        success: false,
        message: "Please upload video file or enter video URL",
      });
    }

    const baseSlug = makeSlug(title);
    let finalSlug = baseSlug;
    let count = 1;

    while (await Video.findOne({ slug: finalSlug })) {
      finalSlug = `${baseSlug}-${count}`;
      count++;
    }

    const video = await Video.create({
      title,
      slug: finalSlug,
      description: description || "",
      category,
      thumbnail,
      videoFile,
      videoUrl: videoUrl || "",
      duration: duration || "2 mins",
      views: "0",
      likes: "0",
      shares: "0",
      rating: 4.5,
      accessType: "free",
      featured: false,
      topPick: false,
      active: false,
      order: 0,
      uploadedBy: req.user._id,
      uploadedByRole: "user",
      approvalStatus: "pending",
      rejectionReason: "",
    });

    res.status(201).json({
      success: true,
      message:
        "Video submitted successfully. It will appear after admin approval.",
      video,
    });
  } catch (error) {
    console.error("userUploadVideo error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit video",
    });
  }
};

const getMyUploadedVideos = async (req, res) => {
  try {
    const videos = await Video.find({
      uploadedBy: req.user._id,
      uploadedByRole: "user",
    }).sort({ createdAt: -1 });

    res.json({ success: true, videos });
  } catch (error) {
    console.error("getMyUploadedVideos error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your videos",
    });
  }
};

const getAdminUserVideos = async (req, res) => {
  try {
    const videos = await Video.find({
      uploadedByRole: "user",
    })
      .populate("uploadedBy", "name email phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, videos });
  } catch (error) {
    console.error("getAdminUserVideos error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user videos",
    });
  }
};

const updateUserVideoStatus = async (req, res) => {
  try {
    const { status, rejectionReason = "" } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    video.approvalStatus = status;
    video.rejectionReason = status === "rejected" ? rejectionReason : "";

   if (status === "approved") {
  video.active = true;
  video.approvedAt = new Date();
  video.approvedBy = req.admin?._id || null;
}

if (status === "rejected") {
  video.active = false;
}

if (status === "pending") {
  video.active = false;
}
    await video.save();

    res.json({
      success: true,
      message: `Video ${status} successfully`,
      video,
    });
  } catch (error) {
    console.error("updateUserVideoStatus error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update video status",
    });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    res.json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("deleteVideo error:", error);
    res.status(500).json({ success: false, message: "Failed to delete video" });
  }
};

module.exports = {
  getWatchPageData,
  getVideoBySlug,
  getVideosByCategory,
  getAdminVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  incrementVideoView,
  incrementVideoLike,
  incrementVideoShare,
  getAdminUserVideos,
  userUploadVideo,
  getMyUploadedVideos,
  updateUserVideoStatus,
};
