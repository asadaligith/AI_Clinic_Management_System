const User = require("../models/User");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Get role-appropriate dashboard stats
// @route   GET /api/v1/stats
// @access  all authenticated roles
const getDashboardStats = asyncHandler(async (req, res) => {
  const { role } = req.user;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let stats = {};

  if (role === "admin") {
    const [totalDoctors, totalPatients, totalAppointments, appointmentsToday] =
      await Promise.all([
        User.countDocuments({ role: "doctor" }),
        Patient.countDocuments(),
        Appointment.countDocuments(),
        Appointment.countDocuments({ date: { $gte: today, $lt: tomorrow } }),
      ]);
    stats = { totalDoctors, totalPatients, totalAppointments, appointmentsToday };
  } else if (role === "doctor") {
    const [todaysAppointments, pendingAppointments] = await Promise.all([
      Appointment.countDocuments({
        doctorId: req.user._id,
        date: { $gte: today, $lt: tomorrow },
      }),
      Appointment.countDocuments({
        doctorId: req.user._id,
        status: "pending",
      }),
    ]);
    const patientIds = await Appointment.distinct("patientId", {
      doctorId: req.user._id,
    });
    stats = {
      todaysAppointments,
      totalPatients: patientIds.length,
      pendingAppointments,
    };
  } else if (role === "receptionist") {
    const [todaysAppointments, totalPatients, registeredToday] =
      await Promise.all([
        Appointment.countDocuments({ date: { $gte: today, $lt: tomorrow } }),
        Patient.countDocuments(),
        Patient.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
      ]);
    stats = { todaysAppointments, totalPatients, registeredToday };
  } else if (role === "patient") {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (patient) {
      const [upcomingVisits, totalAppointments, completedVisits] =
        await Promise.all([
          Appointment.countDocuments({
            patientId: patient._id,
            date: { $gte: today },
            status: { $in: ["pending", "confirmed"] },
          }),
          Appointment.countDocuments({ patientId: patient._id }),
          Appointment.countDocuments({
            patientId: patient._id,
            status: "completed",
          }),
        ]);
      stats = { upcomingVisits, totalAppointments, completedVisits };
    } else {
      stats = { upcomingVisits: 0, totalAppointments: 0, completedVisits: 0 };
    }
  }

  ApiResponse.success(res, { stats });
});

module.exports = { getDashboardStats };
