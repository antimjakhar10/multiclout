const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const Video = require("../models/Video");
const { compressVideo, getPublicUploadPath } = require("../utils/compressHelper");

const getAbsolutePath = (publicPath = "") => {
  const cleanPath = String(publicPath).replace(/^\/+/, "");
  return path.join(__dirname, "..", cleanPath);
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const videos = await Video.find({
      videoFile: { $exists: true, $ne: "" },
    });

    console.log(`Found ${videos.length} videos`);

    for (const video of videos) {
      if (!video.videoFile) continue;

      if (video.videoFile.includes("-compressed.mp4")) {
        console.log(`Skipped already compressed: ${video.title}`);
        continue;
      }

      const absolutePath = getAbsolutePath(video.videoFile);

      if (!fs.existsSync(absolutePath)) {
        console.log(`File not found: ${video.videoFile}`);
        continue;
      }

      console.log(`Compressing: ${video.title}`);

      const compressedPath = await compressVideo(absolutePath);
      const publicPath = getPublicUploadPath(compressedPath);

      if (!publicPath) {
        console.log(`Invalid output path: ${video.title}`);
        continue;
      }

      video.videoFile = publicPath;
      await video.save();

      console.log(`Done: ${video.title} -> ${publicPath}`);
    }

    console.log("All existing videos compressed");
    process.exit(0);
  } catch (error) {
    console.error("Compression script failed:", error.message);
    process.exit(1);
  }
};

run();