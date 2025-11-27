import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    // Find user by email
    const user = await User.findOne({ email: "pritamsing1906@gmail.com" });

    if (!user) {
      console.log("❌ User not found with email: pritamsing1906@gmail.com");
      console.log("Please make sure the user is registered first.");
      process.exit(1);
    }

    // Update user role to admin
    const updatedUser = await User.findOneAndUpdate(
      { email: "pritamsing1906@gmail.com" },
      { role: "admin" },
      { new: true }
    );

    console.log("✅ User updated successfully!");
    console.log("Username:", updatedUser.username);
    console.log("Email:", updatedUser.email);
    console.log("Role:", updatedUser.role);
    console.log("\n🎉 You can now login as admin with this email!");

    process.exit(0);
  })
  .catch((err) => {
    console.log("❌ Error:", err.message);
    process.exit(1);
  });
