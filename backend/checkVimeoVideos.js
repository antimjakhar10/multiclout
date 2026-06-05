require("dotenv").config();
const { Vimeo } = require("vimeo");

async function listVideos() {
  const CLIENT_ID = process.env.VIMEO_CLIENT_ID;
  const CLIENT_SECRET = process.env.VIMEO_CLIENT_SECRET;
  const ACCESS_TOKEN = process.env.VIMEO_ACCESS_TOKEN;

  console.log("Checking Vimeo account for latest videos...");
  const client = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN);

  client.request({
    method: "GET",
    path: "/me/videos",
    query: {
      per_page: 5,
      sort: "date",
      direction: "desc"
    }
  }, (error, body, status_code, headers) => {
    if (error) {
      console.error("Failed to list videos:", error);
    } else {
      console.log(`Successfully fetched videos. Total found: ${body.total}`);
      if (body.data && body.data.length > 0) {
        body.data.forEach((video, index) => {
          console.log(`${index + 1}. Title: ${video.name}, Link: ${video.link}, Created: ${video.created_time}`);
        });
      } else {
        console.log("No videos found in this account.");
      }
    }
  });
}

listVideos();
