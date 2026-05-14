const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Video = require("./models/Video");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
};

const videos = [
  {
    title: "YouTube Channel Start Kaise Karein",
    slug: "youtube-channel-start-kaise-karein",
    description: "Channel setup, niche selection aur starting mistakes ka simple guide.",
    category: "Youtube",
    thumbnail: "https://picsum.photos/400/600?random=101",
    duration: "5 mins",
    rating: 4.8,
    topPick: true,
    active: true,
    order: 1,
  },
  {
    title: "YouTube Shorts Se Views Kaise Laayein",
    slug: "youtube-shorts-se-views-kaise-laayein",
    description: "Shorts optimization aur thumbnail-title strategy samjho.",
    category: "Youtube",
    thumbnail: "https://picsum.photos/400/600?random=102",
    duration: "4 mins",
    rating: 4.6,
    topPick: true,
    active: true,
    order: 2,
  },

  {
    title: "Instagram Reels Viral Karne Ke Tips",
    slug: "instagram-reels-viral-karne-ke-tips",
    description: "Reel hooks, retention aur caption strategy ke practical tips.",
    category: "Instagram",
    thumbnail: "https://picsum.photos/400/600?random=103",
    duration: "3 mins",
    rating: 4.7,
    topPick: true,
    active: true,
    order: 3,
  },
  {
    title: "Instagram Growth For Beginners",
    slug: "instagram-growth-for-beginners",
    description: "Organic growth ke liye profile, content aur consistency ka plan.",
    category: "Instagram",
    thumbnail: "https://picsum.photos/400/600?random=104",
    duration: "3 mins",
    rating: 4.5,
    topPick: false,
    active: true,
    order: 4,
  },

  {
    title: "Business Idea Se Income Kaise Start Karein",
    slug: "business-idea-se-income-kaise-start-karein",
    description: "Low investment business start karne ka simple roadmap.",
    category: "Business",
    thumbnail: "https://picsum.photos/400/600?random=105",
    duration: "6 mins",
    rating: 4.7,
    topPick: true,
    active: true,
    order: 5,
  },
  {
    title: "Online Business Build Karne Ki Strategy",
    slug: "online-business-build-karne-ki-strategy",
    description: "Offer, audience aur funnel ko simple language me samjho.",
    category: "Business",
    thumbnail: "https://picsum.photos/400/600?random=106",
    duration: "5 mins",
    rating: 4.4,
    topPick: false,
    active: true,
    order: 6,
  },

  {
    title: "Finance Basics For Beginners",
    slug: "finance-basics-for-beginners",
    description: "Savings, expense control aur basic personal finance concepts.",
    category: "Finance",
    thumbnail: "https://picsum.photos/400/600?random=107",
    duration: "4 mins",
    rating: 4.6,
    topPick: true,
    active: true,
    order: 7,
  },
  {
    title: "Passive Income Samajhne Ka Easy Guide",
    slug: "passive-income-samajhne-ka-easy-guide",
    description: "Passive income myths aur realistic approach ka breakdown.",
    category: "Finance",
    thumbnail: "https://picsum.photos/400/600?random=108",
    duration: "4 mins",
    rating: 4.3,
    topPick: false,
    active: true,
    order: 8,
  },

  {
    title: "Health Routine Start Karne Ka Sahi Tareeka",
    slug: "health-routine-start-karne-ka-sahi-tareeka",
    description: "Basic fitness, sleep aur daily routine improve karne ke steps.",
    category: "Health",
    thumbnail: "https://picsum.photos/400/600?random=109",
    duration: "3 mins",
    rating: 4.5,
    topPick: false,
    active: true,
    order: 9,
  },
  {
    title: "Weight Loss Ke Common Mistakes",
    slug: "weight-loss-ke-common-mistakes",
    description: "Diet aur routine me hone wali common galtiyon ko avoid karo.",
    category: "Health",
    thumbnail: "https://picsum.photos/400/600?random=110",
    duration: "5 mins",
    rating: 4.4,
    topPick: false,
    active: true,
    order: 10,
  },

  {
    title: "Knowledge Growth Ke Liye Best Habits",
    slug: "knowledge-growth-ke-liye-best-habits",
    description: "Learning system aur daily information discipline ka practical model.",
    category: "Knowledge",
    thumbnail: "https://picsum.photos/400/600?random=111",
    duration: "4 mins",
    rating: 4.6,
    topPick: false,
    active: true,
    order: 11,
  },
  {
    title: "Smart Learning Approach For Students",
    slug: "smart-learning-approach-for-students",
    description: "Focused learning aur retention improve karne ka simple tareeka.",
    category: "Knowledge",
    thumbnail: "https://picsum.photos/400/600?random=112",
    duration: "4 mins",
    rating: 4.5,
    topPick: false,
    active: true,
    order: 12,
  },
];

const seed = async () => {
  try {
    await connectDB();

    await Video.deleteMany({});
    await Video.insertMany(videos);

    console.log("Videos seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seed();