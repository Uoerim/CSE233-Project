// server/src/scripts/seedReservations.js
require("dotenv").config();
const connectDB = require("../config/db");
const Classroom = require("../models/Classroom");
const Timeslot = require("../models/Timeslot");
const Reservation = require("../models/Reservation");
const User = require("../models/User");

// Helper: get the next date (today or later) for a given day name
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function getNextDateForDay(targetDayName) {
  const targetIndex = DAY_NAMES.indexOf(targetDayName);
  if (targetIndex === -1) throw new Error("Invalid day name: " + targetDayName);

  const today = new Date();
  const todayIndex = today.getDay();

  let diff = targetIndex - todayIndex;
  if (diff < 0) diff += 7; // go to next week if passed

  const result = new Date(today);
  result.setDate(today.getDate() + diff);
  // normalize time to midnight
  result.setHours(0, 0, 0, 0);
  return result;
}

const run = async () => {
  try {
    await connectDB();

    // 1) Get a classroom
    const classroom = await Classroom.findOne();
    if (!classroom) {
      console.log("No classrooms found. Seed a classroom first.");
      process.exit(0);
    }

    // 2) Get an admin (or any) user for createdBy
    let user = await User.findOne({ role: "admin" });
    if (!user) {
      user = await User.findOne();
    }
    if (!user) {
      console.log("No users found. Create at least one user first.");
      process.exit(0);
    }

    // 3) Pick a day that has timeslots (e.g. first day we find)
    const anyTimeslot = await Timeslot.findOne();
    if (!anyTimeslot) {
      console.log("No timeslots found. Seed timeslots first.");
      process.exit(0);
    }

    const dayOfWeek = anyTimeslot.dayOfWeek;
    const timeslotsForDay = await Timeslot.find({ dayOfWeek });

    // 4) Compute the next calendar date for that day
    const reservationDate = getNextDateForDay(dayOfWeek);

    console.log(
      `Creating reservations for classroom ${classroom.name} on ${reservationDate.toISOString().slice(0, 10)} (${dayOfWeek})`
    );

    // Optional: clear existing reservations for that room/date so seeding is repeatable
    await Reservation.deleteMany({
      classroom: classroom._id,
      date: reservationDate,
    });

    const reservationsToCreate = timeslotsForDay.map((ts) => ({
      classroom: classroom._id,
      timeslot: ts._id,
      date: reservationDate,
      reservedFor: "Test Reservation – " + classroom.name,
      createdBy: user._id,
      status: "confirmed",
    }));

    const created = await Reservation.insertMany(reservationsToCreate);

    console.log(`Created ${created.length} reservations.`);
    console.log(
      "Use this date in your availability API test:",
      reservationDate.toISOString().slice(0, 10)
    );

    process.exit(0);
  } catch (err) {
    console.error("Seed reservations error:", err);
    process.exit(1);
  }
};

run();
