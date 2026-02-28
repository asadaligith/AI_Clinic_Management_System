const express = require("express");
const {
  createAppointment,
  getAppointments,
  getDoctorAppointments,
  getDoctorPatients,
  updateStatus,
  deleteAppointment,
} = require("../controllers/appointmentController");
const { protect, authorize } = require("../middleware/auth");
const {
  createAppointmentRules,
  updateStatusRules,
} = require("../middleware/validate");

const router = express.Router();

router.use(protect);

// Doctor-specific routes (must be above generic routes)
router.get("/doctor/me", authorize("doctor"), getDoctorAppointments);
router.get("/doctor/patients", authorize("doctor"), getDoctorPatients);

router
  .route("/")
  .post(authorize("receptionist", "admin"), createAppointmentRules, createAppointment)
  .get(authorize("admin", "doctor", "receptionist", "patient"), getAppointments);

router
  .route("/:id/status")
  .put(authorize("doctor", "admin"), updateStatusRules, updateStatus);

router
  .route("/:id")
  .delete(authorize("receptionist", "admin"), deleteAppointment);

module.exports = router;
