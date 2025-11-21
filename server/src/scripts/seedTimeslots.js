// server/src/scripts/seedTimeslots.js
require("dotenv").config();
const connectDB = require("../config/db");
const Timeslot = require("../models/Timeslot");

const run = async () => {
  try {
    await connectDB();

    console.log("Clearing existing timeslots...");
    await Timeslot.deleteMany({});

    const timeslots = [
      // Sunday
      { dayOfWeek: "Sunday", startTime: "08:00", endTime: "10:00" },
      { dayOfWeek: "Sunday", startTime: "10:00", endTime: "12:00" },

      // Monday
      { dayOfWeek: "Monday", startTime: "08:00", endTime: "10:00" },
      { dayOfWeek: "Monday", startTime: "10:00", endTime: "12:00" },

      // Tuesday
      { dayOfWeek: "Tuesday", startTime: "08:00", endTime: "10:00" },
      { dayOfWeek: "Tuesday", startTime: "10:00", endTime: "12:00" },
    ];

    const created = await Timeslot.insertMany(timeslots);
    console.log(`Created ${created.length} timeslots`);
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

run();
