const Tutorial = require("../models/Tutorial");

const extractYouTubeVideoId = (url = "") => {
  try {
    const cleanUrl = String(url).trim();

    if (!cleanUrl) return "";

    if (cleanUrl.includes("youtube.com/embed/")) {
      return cleanUrl.split("/embed/")[1]?.split("?")[0] || "";
    }

    if (cleanUrl.includes("youtu.be/")) {
      return cleanUrl.split("youtu.be/")[1]?.split("?")[0] || "";
    }

    if (cleanUrl.includes("youtube.com/watch?v=")) {
      return cleanUrl.split("watch?v=")[1]?.split("&")[0] || "";
    }

    if (cleanUrl.includes("youtube.com/shorts/")) {
      return cleanUrl.split("/shorts/")[1]?.split("?")[0] || "";
    }

    return "";
  } catch (error) {
    return "";
  }
};

const getYoutubeEmbedUrl = (url = "") => {
  const videoId = extractYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
};

const getYoutubeWatchUrl = (url = "") => {
  const videoId = extractYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : "";
};

// add tutorial
exports.addTutorial = async (req, res) => {
  try {
    const { title, videoUrl, description, order, active } = req.body;

    if (!title || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: "Title and video URL are required",
      });
    }

    const embedUrl = getYoutubeEmbedUrl(videoUrl);
    const watchUrl = getYoutubeWatchUrl(videoUrl);

    if (!embedUrl || !watchUrl) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid YouTube link",
      });
    }

    const tutorial = await Tutorial.create({
      title,
      videoUrl: watchUrl,
      description: description || "",
      order: Number(order) || 0,
      active: active === "false" || active === false ? false : true,
    });

    res.status(201).json({
      success: true,
      message: "Tutorial added successfully",
      tutorial: {
        ...tutorial.toObject(),
        embedUrl,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add tutorial",
      error: error.message,
    });
  }
};

// public tutorials
exports.getTutorials = async (req, res) => {
  try {
    const tutorials = await Tutorial.find({ active: true }).sort({
      order: 1,
      createdAt: -1,
    });

    const updatedTutorials = tutorials.map((item) => ({
      ...item.toObject(),
      embedUrl: getYoutubeEmbedUrl(item.videoUrl),
    }));

    res.status(200).json({
      success: true,
      count: updatedTutorials.length,
      tutorials: updatedTutorials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tutorials",
      error: error.message,
    });
  }
};

// admin all tutorials
exports.getAllTutorialsAdmin = async (req, res) => {
  try {
    const tutorials = await Tutorial.find().sort({
      order: 1,
      createdAt: -1,
    });

    const updatedTutorials = tutorials.map((item) => ({
      ...item.toObject(),
      embedUrl: getYoutubeEmbedUrl(item.videoUrl),
    }));

    res.status(200).json({
      success: true,
      count: updatedTutorials.length,
      tutorials: updatedTutorials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tutorials",
      error: error.message,
    });
  }
};

// single tutorial
exports.getSingleTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: "Tutorial not found",
      });
    }

    res.status(200).json({
      success: true,
      tutorial: {
        ...tutorial.toObject(),
        embedUrl: getYoutubeEmbedUrl(tutorial.videoUrl),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tutorial",
      error: error.message,
    });
  }
};

// update tutorial
exports.updateTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: "Tutorial not found",
      });
    }

    tutorial.title = req.body.title ?? tutorial.title;
    tutorial.description = req.body.description ?? tutorial.description;
    tutorial.order =
      req.body.order !== undefined ? Number(req.body.order) || 0 : tutorial.order;

    if (req.body.videoUrl !== undefined) {
      const watchUrl = getYoutubeWatchUrl(req.body.videoUrl);

      if (!watchUrl) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid YouTube link",
        });
      }

      tutorial.videoUrl = watchUrl;
    }

    if (req.body.active !== undefined) {
      tutorial.active =
        req.body.active === "false" || req.body.active === false ? false : true;
    }

    await tutorial.save();

    res.status(200).json({
      success: true,
      message: "Tutorial updated successfully",
      tutorial: {
        ...tutorial.toObject(),
        embedUrl: getYoutubeEmbedUrl(tutorial.videoUrl),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update tutorial",
      error: error.message,
    });
  }
};

// delete tutorial
exports.deleteTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: "Tutorial not found",
      });
    }

    await Tutorial.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Tutorial deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete tutorial",
      error: error.message,
    });
  }
};