import mongoose from "mongoose";
import User from "./models/User.js";
import { loadLocalDb } from "./utils/helpers.js";
import 'dotenv/config';

const viewPasswords = async () => {
  console.log("=== LOCAL DATABASE USERS ===");
  try {
    const localDb = await loadLocalDb();
    if (localDb && localDb.users && localDb.users.length > 0) {
      localDb.users.forEach((user) => {
        console.log(`Email: ${user.email} | Name: ${user.name} | Password Field: ${user.password || "(none)"}`);
      });
    } else {
      console.log("No users found in local database.");
    }
  } catch (err) {
    console.error("Could not read local DB:", err.message);
  }

  console.log("\n=== MONGODB DATABASE USERS ===");
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI not found in backend/.env file.");
      return;
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully.");

    const users = await User.find({}, "email name password provider");
    if (users.length === 0) {
      console.log("No users found in MongoDB.");
    } else {
      users.forEach((user) => {
        console.log(`Email: ${user.email} | Name: ${user.name} | Password Field (Hashed): ${user.password || "(none)"} | Provider: ${user.provider}`);
      });
    }
  } catch (error) {
    console.error("Failed to connect or fetch from MongoDB:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

viewPasswords();
