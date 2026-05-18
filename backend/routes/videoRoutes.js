const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  getWatchPageData,
  getVideoBySlug,
  getVideosByCategory,
  getVideoCategories,
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
} = require("../controllers/videoController");

const {
  optionalProtect,
  protect,
  protectAdmin,
} = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.get("/watch-page", optionalProtect, getWatchPageData);
router.get("/categories/list", getVideoCategories);
router.get("/category/:slug", optionalProtect, getVideosByCategory);
router.get("/admin/all", protectAdmin, getAdminVideos);

router.post(
  "/user/upload",
  protect,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "videoFile", maxCount: 1 },
  ]),
  userUploadVideo
);

router.get("/user/my-videos", protect, getMyUploadedVideos);

router.get("/admin/user-videos", protectAdmin, getAdminUserVideos);

router.put(
  "/admin/user-videos/:id/status",
  protectAdmin,
  updateUserVideoStatus
);
router.post("/:slug/view", incrementVideoView);
router.post("/:slug/like", incrementVideoLike);
router.post("/:slug/share", incrementVideoShare);

router.get("/:slug", optionalProtect, getVideoBySlug);

router.post(
  "/admin/add",
  protectAdmin,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "videoFile", maxCount: 1 },
  ]),
  createVideo,
);

router.put(
  "/admin/update/:id",
  protectAdmin,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "videoFile", maxCount: 1 },
  ]),
  updateVideo,
);

router.delete("/admin/delete/:id", protectAdmin, deleteVideo);

module.exports = router;
