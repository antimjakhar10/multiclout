const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const faqRoutes = require("./routes/faqRoutes");
const statRoutes = require("./routes/statRoutes");
const reasonRoutes = require("./routes/reasonRoutes");
const tutorialRoutes = require("./routes/tutorialRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const videoRoutes = require("./routes/videoRoutes");
const siteSettingsRoutes = require("./routes/siteSettingsRoutes");
const blogRoutes = require("./routes/blogRoutes");
const franchiseRoutes = require("./routes/franchiseRoutes");
const otpRoutes = require("./routes/otpRoutes");
const userRoutes = require("./routes/userRoutes");
const planSettingsRoutes = require("./routes/planSettingsRoutes");
const orderRoutes = require("./routes/orderRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");

dotenv.config();

const app = express();

connectDB();

const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://multiclout.com",
      "https://www.multiclout.com",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    return res.status(200).json({
      success: true,
      image: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);

app.use("/api/courses", courseRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/reasons", reasonRoutes);
app.use("/api/tutorials", tutorialRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/site-settings", siteSettingsRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/franchise", franchiseRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/users", userRoutes);
app.use("/api/plan-settings", planSettingsRoutes);
app.use("/api/orders", orderRoutes);
// app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Multiclout Backend Running...");
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Multiclout API is working",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});