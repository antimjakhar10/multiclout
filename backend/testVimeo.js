require("dotenv").config();
const { uploadToVimeo } = require("./utils/vimeoHelper");
const fs = require("fs");
const path = require("path");

async function testVimeo() {
  console.log("Starting Vimeo test...");
  console.log("CLIENT_ID:", process.env.VIMEO_CLIENT_ID ? "Loaded" : "MISSING");
  console.log("CLIENT_SECRET:", process.env.VIMEO_CLIENT_SECRET ? "Loaded" : "MISSING");
  console.log("ACCESS_TOKEN:", process.env.VIMEO_ACCESS_TOKEN ? "Loaded" : "MISSING");

  // Create a dummy video file if none exists
  const dummyPath = path.join(__dirname, "test-video.txt");
  fs.writeFileSync(dummyPath, "This is a dummy video file for testing upload logic.");

  try {
    // Note: This might fail if Vimeo expects a real video format, 
    // but we want to see if the client initializes and attempts upload.
    console.log("Attempting upload...");
    // We won't actually call uploadToVimeo if we don't want to waste their quota,
    // but the user says it's NOT working, so let's see.
    // Actually, let's just test the client initialization.
    const { Vimeo } = require("vimeo");
    const client = new Vimeo(
      process.env.VIMEO_CLIENT_ID,
      process.env.VIMEO_CLIENT_SECRET,
      process.env.VIMEO_ACCESS_TOKEN
    );

    client.request({
      method: "GET",
      path: "/me"
    }, (error, body, status_code, headers) => {
      if (error) {
        console.error("Vimeo Auth Test Failed:", error);
      } else {
        console.log("Vimeo Auth Test Success! User:", body.name);
      }
      fs.unlinkSync(dummyPath);
    });

  } catch (err) {
    console.error("Test execution failed:", err);
  }
}

testVimeo();
