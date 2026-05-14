const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const exists = await Admin.findOne({ email: "admin@multiclout.com" });
    if (exists) {
      console.log("Admin already exists");
      process.exit();
    }

    await Admin.create({
      name: "Multiclout Admin",
      email: "admin@multiclout.com",
      password: "12345678",
    });

    console.log("Admin created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();