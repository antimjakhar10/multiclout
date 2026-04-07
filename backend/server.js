const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const reelRoutes = require("./routes/reelRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const faqRoutes = require("./routes/faqRoutes");
const statRoutes = require("./routes/statRoutes");
const reasonRoutes = require("./routes/reasonRoutes");

dotenv.config();

const app = express();

connectDB();

const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/reels", reelRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/reasons", reasonRoutes);

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