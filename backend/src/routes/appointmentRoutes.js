const express = require("express");
const {
  createAppointment,
  getAppointments,
  updateStatus,
  deleteAppointment,
  getDoctors,
} = require("../controllers/appointmentController");
const { protect, authorize } = require("../middleware/auth");
const {
  createAppointmentRules,
  updateStatusRules,
} = require("../middleware/validate");

const router = express.Router();

router.use(protect);

// Doctors list for booking dropdown
router.get("/doctors", authorize("receptionist", "admin"), getDoctors);

router
  .route("/")
  .post(authorize("receptionist", "admin"), createAppointmentRules, createAppointment)
  .get(authorize("admin", "doctor", "receptionist"), getAppointments);

router
  .route("/:id/status")
  .put(authorize("doctor", "admin"), updateStatusRules, updateStatus);

router
  .route("/:id")
  .delete(authorize("receptionist", "admin"), deleteAppointment);

module.exports = router;
