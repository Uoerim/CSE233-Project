const express = require("express");
const router = express.Router();

const { getClassroomAvailability, getAllClassrooms, getAllReservations, getDatabaseStats } = require("../controllers/facilitiesController");
const { protect } = require("../middleware/auth");

// More specific routes first
router.get("/classrooms/availability", protect, getClassroomAvailability);
router.get("/stats", protect, getDatabaseStats);

// General routes
router.get("/classrooms", protect, getAllClassrooms);
router.get("/reservations", protect, getAllReservations);

module.exports = router;
