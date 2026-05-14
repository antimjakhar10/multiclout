const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegStatic = require("ffmpeg-static");

ffmpeg.setFfmpegPath(ffmpegStatic);

const compressVideo = (inputPath) => {
  return new Promise((resolve) => {
    if (!inputPath || !fs.existsSync(inputPath)) {
      return resolve(inputPath);
    }

    const parsed = path.parse(inputPath);
    const outputPath = path.join(parsed.dir, `${parsed.name}-compressed.mp4`);

    ffmpeg(inputPath)
      .outputOptions([
  "-vf scale='min(720,iw)':-2",
  "-c:v libx264",
  "-preset veryfast",
  "-crf 30",
  "-c:a aac",
  "-b:a 64k",
  "-movflags +faststart",
])
      .format("mp4")
      .on("end", () => {
        try {
          fs.unlinkSync(inputPath);
        } catch (err) {
          console.error("Original video delete failed:", err.message);
        }

        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error("Video compression failed:", err.message);
        resolve(inputPath);
      })
      .save(outputPath);
  });
};

const getPublicUploadPath = (filePath = "") => {
  const normalized = filePath.replace(/\\/g, "/");
  const index = normalized.lastIndexOf("uploads/");

  return index !== -1 ? `/${normalized.slice(index)}` : "";
};

module.exports = { compressVideo, getPublicUploadPath };