const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// Valid status transitions: pending → confirmed → completed
const VALID_TRANSITIONS = {
  pending: ["confirmed"],
  confirmed: ["completed"],
  completed: [],
};

// @desc    Create appointment
// @route   POST /api/v1/appointments
// @access  receptionist, admin, patient
const createAppointment = asyncHandler(async (req, res) => {
  let { patientId, doctorId, date, reason } = req.body;

  // If patient role, auto-set patientId from their linked Patient record
  if (req.user.role === "patient") {
    let myPatient = await Patient.findOne({ userId: req.user._id });
    // Auto-create Patient record if missing (for older accounts registered before fix)
    if (!myPatient) {
      myPatient = await Patient.create({
        name: req.user.name,
        email: req.user.email,
        userId: req.user._id,
        createdBy: req.user._id,
      });
    }
    patientId = myPatient._id;
  }

  // Verify patient exists
  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw ApiError.notFound("Patient not found");
  }

  // Verify doctor exists and has doctor role
  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.role !== "doctor") {
    throw ApiError.badRequest("Invalid doctor selected");
  }

  const appointment = await Appointment.create({
    patientId,
    doctorId,
    date,
    reason,
    bookedBy: req.user.role,
    createdBy: req.user._id,
  });

  const populated = await Appointment.findById(appointment._id)
    .populate("patientId", "name age gender contact")
    .populate("doctorId", "name email")
    .populate("createdBy", "name role");

  ApiResponse.created(res, { appointment: populated }, "Appointment booked successfully");
});

// @desc    Get appointments (role-scoped + filters)
// @route   GET /api/v1/appointments
// @access  admin (all), doctor (own), receptionist (all), patient (own)
const getAppointments = asyncHandler(async (req, res) => {
  const { status, date, page = 1, limit = 10 } = req.query;
  const filter = {};

  // Role-based scoping
  if (req.user.role === "doctor") {
    filter.doctorId = req.user._id;
  } else if (req.user.role === "patient") {
    let myPatient = await Patient.findOne({ userId: req.user._id });
    if (!myPatient) {
      myPatient = await Patient.create({
        name: req.user.name,
        email: req.user.email,
        userId: req.user._id,
        createdBy: req.user._id,
      });
    }
    filter.patientId = myPatient._id;
  }

  if (status) filter.status = status;
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    filter.date = { $gte: start, $lte: end };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [appointments, total] = await Promise.all([
    Appointment.find(filter)
      .populate("patientId", "name age gender contact")
      .populate("doctorId", "name email")
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Appointment.countDocuments(filter),
  ]);

  ApiResponse.success(res, {
    appointments,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// @desc    Get doctor's own appointments
// @route   GET /api/v1/appointments/doctor/me
// @access  doctor
const getDoctorAppointments = asyncHandler(async (req, res) => {
  const { status, date, page = 1, limit = 10 } = req.query;
  const filter = { doctorId: req.user._id };

  if (status) filter.status = status;
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    filter.date = { $gte: start, $lte: end };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [appointments, total] = await Promise.all([
    Appointment.find(filter)
      .populate("patientId", "name age gender contact")
      .populate("doctorId", "name email")
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Appointment.countDocuments(filter),
  ]);

  ApiResponse.success(res, {
    appointments,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// @desc    Get doctor's assigned patients (distinct from appointments)
// @route   GET /api/v1/appointments/doctor/patients
// @access  doctor
const getDoctorPatients = asyncHandler(async (req, res) => {
  const patientIds = await Appointment.distinct("patientId", {
    doctorId: req.user._id,
  });

  const patients = await Patient.find({ _id: { $in: patientIds } })
    .populate("createdBy", "name role")
    .sort({ name: 1 });

  ApiResponse.success(res, { patients });
});

// @desc    Update appointment status
// @route   PUT /api/v1/appointments/:id/status
// @access  doctor (own appointments), admin
const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    throw ApiError.notFound("Appointment not found");
  }

  // Doctor can only update their own appointments
  if (
    req.user.role === "doctor" &&
    appointment.doctorId.toString() !== req.user._id.toString()
  ) {
    throw ApiError.forbidden("You can only update your own appointments");
  }

  // Enforce valid status transitions: pending → confirmed → completed
  const currentStatus = appointment.status;
  const validNext = VALID_TRANSITIONS[currentStatus];
  if (!validNext || !validNext.includes(status)) {
    throw ApiError.badRequest(
      `Cannot change status from '${currentStatus}' to '${status}'`
    );
  }

  appointment.status = status;
  await appointment.save();

  const populated = await Appointment.findById(appointment._id)
    .populate("patientId", "name age gender contact")
    .populate("doctorId", "name email");

  ApiResponse.success(res, { appointment: populated }, "Status updated successfully");
});

// @desc    Delete appointment
// @route   DELETE /api/v1/appointments/:id
// @access  receptionist, admin
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    throw ApiError.notFound("Appointment not found");
  }

  await appointment.deleteOne();

  ApiResponse.success(res, null, "Appointment deleted successfully");
});

module.exports = {
  createAppointment,
  getAppointments,
  getDoctorAppointments,
  getDoctorPatients,
  updateStatus,
  deleteAppointment,
};
