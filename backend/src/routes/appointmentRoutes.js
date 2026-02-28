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

// Doctors list for booking dropdown (patient can also access)
router.get("/doctors", authorize("receptionist", "admin", "patient"), getDoctors);

router
  .route("/")
  .post(authorize("receptionist", "admin", "patient"), createAppointmentRules, createAppointment)
  .get(authorize("admin", "doctor", "receptionist", "patient"), getAppointments);

router
  .route("/:id/status")
  .put(authorize("doctor", "admin"), updateStatusRules, updateStatus);

router
  .route("/:id")
  .delete(authorize("receptionist", "admin"), deleteAppointment);

module.exports = router;
