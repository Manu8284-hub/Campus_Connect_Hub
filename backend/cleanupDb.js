import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./models/Event.js";
import User from "./models/User.js";

dotenv.config();

async function run() {
  const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campus-connect";
  try {
    console.log("Connecting to MongoDB at:", MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for cleanup...");

    // Find and update the "abs" event
    const absEvent = await Event.findOne({ title: "abs" });
    if (absEvent) {
      absEvent.title = "AI & Deep Learning Hackathon";
      absEvent.date = "2026-05-15";
      absEvent.time = "10:00 AM";
      absEvent.venue = "Engineering Auditorium, Hall A";
      absEvent.description = "Explore the frontiers of artificial intelligence, neural networks, and generative models in a collaborative team sprint.";
      await absEvent.save();
      console.log("Successfully updated 'abs' event to 'AI & Deep Learning Hackathon'");
    }

    // General update for any events with 20026 year or other weird inputs
    const badYearEvents = await Event.find({ date: /20026/ });
    for (const event of badYearEvents) {
      event.date = event.date.replace("20026", "2026");
      await event.save();
      console.log(`Fixed bad year on event: ${event.title}`);
    }

    const dfgdEvents = await Event.find({ venue: "dfgd" });
    for (const event of dfgdEvents) {
      event.venue = "Engineering Auditorium, Hall A";
      await event.save();
      console.log(`Fixed dfgd venue on event: ${event.title}`);
    }

    // Clean up event registrations inside user profiles if they have bad dates
    const users = await User.find({});
    let usersCleaned = 0;
    for (const user of users) {
      let modified = false;
      if (user.eventRegistrations && user.eventRegistrations.length > 0) {
        user.eventRegistrations = user.eventRegistrations.map((reg) => {
          const updatedReg = { ...reg.toObject() };
          if (updatedReg.certificateIssuedAt) {
            const dateObj = new Date(updatedReg.certificateIssuedAt);
            if (dateObj.getFullYear() === 20026) {
              dateObj.setFullYear(2026);
              updatedReg.certificateIssuedAt = dateObj;
              modified = true;
            }
          }
          if (updatedReg.registeredAt) {
            const dateObj = new Date(updatedReg.registeredAt);
            if (dateObj.getFullYear() === 20026) {
              dateObj.setFullYear(2026);
              updatedReg.registeredAt = dateObj;
              modified = true;
            }
          }
          return updatedReg;
        });
      }
      if (modified) {
        user.markModified("eventRegistrations");
        await user.save();
        usersCleaned++;
        console.log(`Cleaned up user registration date for: ${user.name}`);
      }
    }

    console.log(`Database cleanup finished. Checked all users, fixed registrations for ${usersCleaned} users.`);
    process.exit(0);
  } catch (error) {
    console.error("Cleanup error:", error);
    process.exit(1);
  }
}

run();
