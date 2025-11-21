// src/controllers/facilitiesController.js
const Classroom = require("../models/Classroom");
const Timeslot = require("../models/Timeslot");
const Reservation = require("../models/Reservation");

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

exports.getClassroomAvailability = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res
        .status(400)
        .json({ message: "Query parameter 'date' is required (YYYY-MM-DD)" });
    }

    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const dayOfWeek = DAY_NAMES[selectedDate.getDay()];

    const classrooms = await Classroom.find({ isActive: true }).lean();
    const timeslots = await Timeslot.find({ dayOfWeek }).lean();

    if (!timeslots.length || !classrooms.length) {
      return res.json({
        date,
        dayOfWeek,
        slots: [],
      });
    }

    const classroomIds = classrooms.map((c) => c._id);
    const timeslotIds = timeslots.map((t) => t._id);

    const reservations = await Reservation.find({
      date: selectedDate,
      classroom: { $in: classroomIds },
      timeslot: { $in: timeslotIds },
    }).lean();

    const reservedSet = new Set(
      reservations.map(
        (r) => `${r.classroom.toString()}-${r.timeslot.toString()}`
      )
    );

    const slots = timeslots.map((ts) => {
      const availableRooms = classrooms
        .filter(
          (room) =>
            !reservedSet.has(`${room._id.toString()}-${ts._id.toString()}`)
        )
        .map((room) => ({
          id: room._id,
          name: room.name,
          building: room.building,
          capacity: room.capacity,
        }));

      return {
        timeslotId: ts._id,
        dayOfWeek,
        startTime: ts.startTime,
        endTime: ts.endTime,
        availableRooms,
      };
    });

    res.json({
      date,
      dayOfWeek,
      slots,
    });
  } catch (err) {
    console.error("Error in getClassroomAvailability:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find().sort({ name: 1 });

    res.json({
      success: true,
      count: classrooms.length,
      classrooms,
    });
  } catch (err) {
    console.error("Error in getAllClassrooms:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("classroom", "name building capacity")
      .populate("timeslot", "startTime endTime dayOfWeek")
      .populate("createdBy", "name username")
      .sort({ date: -1 });

    res.json({
      success: true,
      count: reservations.length,
      reservations,
    });
  } catch (err) {
    console.error("Error in getAllReservations:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDatabaseStats = async (req, res) => {
  try {
    const classroomCount = await Classroom.countDocuments();
    const reservationCount = await Reservation.countDocuments();
    const timeslotCount = await Timeslot.countDocuments();

    res.json({
      success: true,
      stats: {
        classrooms: classroomCount,
        reservations: reservationCount,
        timeslots: timeslotCount,
      },
    });
  } catch (err) {
    console.error("Error in getDatabaseStats:", err);
    res.status(500).json({ message: "Server error" });
  }
};
