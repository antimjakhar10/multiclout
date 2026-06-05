require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const Video = require("./models/Video");

async function check5Videos() {
  await mongoose.connect(process.env.MONGO_URI);
  const videos = await Video.find().sort({ createdAt: -1 }).limit(5);
  let data = "Recent Videos:\n";
  videos.forEach((v, i) => {
    data += `${i+1}. ID: ${v._id}, Title: ${v.title}, Category: ${v.category}, VideoFile: ${v.videoFile}, CreatedAt: ${v.createdAt}\n`;
  });
  fs.writeFileSync("db_result_5.txt", data);
  console.log("Details written to db_result_5.txt");
  await mongoose.disconnect();
}

check5Videos();
