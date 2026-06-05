const fs = require("fs");
const { Vimeo } = require("@vimeo/vimeo");

const client = new Vimeo(
  process.env.VIMEO_CLIENT_ID || "",
  process.env.VIMEO_CLIENT_SECRET || "",
  process.env.VIMEO_ACCESS_TOKEN || ""
);

const getVimeoIdFromUri = (uri = "") => {
  const match = String(uri).match(/\/videos\/(\d+)/);
  return match ? match[1] : "";
};

const uploadToVimeo = (
  filePath,
  title = "Multiclout Video",
  description = ""
) => {
  return new Promise((resolve, reject) => {
    try {
      if (!process.env.VIMEO_ACCESS_TOKEN) {
        return reject(
          new Error("VIMEO_ACCESS_TOKEN missing in .env")
        );
      }

      if (!fs.existsSync(filePath)) {
        return reject(
          new Error(`Video file not found: ${filePath}`)
        );
      }

      console.log("========== VIMEO UPLOAD START ==========");
      console.log("File:", filePath);
      console.log("Title:", title);

      console.log(
        "Token Last 8:",
        process.env.VIMEO_ACCESS_TOKEN
          ? process.env.VIMEO_ACCESS_TOKEN.slice(-8)
          : "NO_TOKEN"
      );

      client.upload(
        filePath,
        {
          name: title || "Multiclout Video",
          description: description || "",
        },

        function success(uri) {
          const vimeoId = getVimeoIdFromUri(uri);

          console.log(
            "========== VIMEO UPLOAD SUCCESS =========="
          );

          console.log("Vimeo URI:", uri);
          console.log("Vimeo ID:", vimeoId);

          console.log(
            "Manage URL:",
            `https://vimeo.com/manage/videos/${vimeoId}`
          );

          console.log(
            "Public Link:",
            `https://vimeo.com/${vimeoId}`
          );

          console.log(
            "Embed URL:",
            `https://player.vimeo.com/video/${vimeoId}`
          );

          if (!vimeoId) {
            return reject(
              new Error(
                "Vimeo upload success but video id not found"
              )
            );
          }

          client.request(
  {
    method: "PATCH",
    path: uri,
    query: {
      privacy: {
        view: "anybody",
        embed: "public",
      },
      embed: {
        buttons: {
          like: false,
          watchlater: false,
          share: false,
        },
      },
    },
  },

  function (error) {
    if (error) {
      console.log("Vimeo privacy update failed:", error);
    } else {
      console.log("Vimeo privacy updated successfully");
    }

    resolve({
      uri,
      vimeoId,
      link: `https://vimeo.com/${vimeoId}`,
      manageUrl: `https://vimeo.com/manage/videos/${vimeoId}`,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
    });
  }
);
        },

        function progress(bytesUploaded, bytesTotal) {
          const percent =
            bytesTotal > 0
              ? (
                  (bytesUploaded / bytesTotal) *
                  100
                ).toFixed(2)
              : "0.00";

          console.log(
            `[Vimeo Upload Progress] ${percent}%`
          );
        },

        function failure(error) {
          console.log(
            "========== VIMEO UPLOAD FAILED =========="
          );

          console.error(error);

          const message =
            error?.message ||
            error?.error ||
            JSON.stringify(error) ||
            "Unknown Vimeo upload error";

          reject(new Error(message));
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { uploadToVimeo };