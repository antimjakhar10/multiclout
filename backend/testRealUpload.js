require("dotenv").config();
const { uploadToVimeo } = require("./utils/vimeoHelper");
const fs = require("fs");
const path = require("path");

async function testRealUpload() {
  console.log("Starting REAL Vimeo upload test...");
  
  // Create a tiny valid mp4 if possible, or just a dummy file
  // Vimeo might reject non-video files. Let's try a dummy file first.
  const dummyPath = path.join(__dirname, "test-video.mp4");
  fs.writeFileSync(dummyPath, "Dummy content. Vimeo might reject this but let's see if the process starts.");

  try {
    const link = await uploadToVimeo(dummyPath, "Test Video " + Date.now(), "Testing Vimeo Integration");
    console.log("UPLOAD SUCCESSFUL! Link:", link);
  } catch (err) {
    console.error("UPLOAD FAILED:", err);
  } finally {
    if (fs.existsSync(dummyPath)) fs.unlinkSync(dummyPath);
  }
}

testRealUpload();
