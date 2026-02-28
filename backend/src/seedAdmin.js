const mongoose = require("mongoose");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();
const User = require("./models/User");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const existing = await User.findOne({ email: "admin@clinic.com" });
    if (existing) {
      console.log("Admin already exists:");
      console.log("  Email:    admin@clinic.com");
      console.log("  Role:     " + existing.role);
      process.exit(0);
    }

    const admin = await User.create({
      name: "Admin",
      email: "admin@clinic.com",
      password: "admin123",
      role: "admin",
    });

    console.log("Admin created successfully!");
    console.log("  Email:    admin@clinic.com");
    console.log("  Password: admin123");
    console.log("  Role:     admin");
    console.log("  ID:       " + admin._id);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
};

seedAdmin();
