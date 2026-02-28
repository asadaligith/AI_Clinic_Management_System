const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// @desc    Create prescription (linked to appointment)
// @route   POST /api/v1/prescriptions
// @access  doctor
const createPrescription = asyncHandler(async (req, res) => {
  const { appointmentId, medicines, instructions } = req.body;

  // Verify appointment exists and belongs to this doctor
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw ApiError.notFound("Appointment not found");
  }

  if (appointment.doctorId.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden("You can only prescribe for your own appointments");
  }

  // Check if prescription already exists for this appointment
  const existing = await Prescription.findOne({ appointmentId });
  if (existing) {
    throw ApiError.badRequest("Prescription already exists for this appointment");
  }

  const prescription = await Prescription.create({
    patientId: appointment.patientId,
    doctorId: req.user._id,
    appointmentId,
    medicines,
    instructions,
  });

  const populated = await Prescription.findById(prescription._id)
    .populate("patientId", "name age gender contact")
    .populate("doctorId", "name email")
    .populate("appointmentId", "date status");

  ApiResponse.created(res, { prescription: populated }, "Prescription created successfully");
});

// @desc    Get prescriptions (role-scoped)
// @route   GET /api/v1/prescriptions
// @access  admin (all), doctor (own), patient (own)
const getPrescriptions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const filter = {};

  if (req.user.role === "doctor") {
    filter.doctorId = req.user._id;
  } else if (req.user.role === "patient") {
    const myPatient = await Patient.findOne({ userId: req.user._id });
    if (!myPatient) {
      return ApiResponse.success(res, {
        prescriptions: [],
        pagination: { total: 0, page: 1, limit: Number(limit), pages: 0 },
      });
    }
    filter.patientId = myPatient._id;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [prescriptions, total] = await Promise.all([
    Prescription.find(filter)
      .populate("patientId", "name age gender contact")
      .populate("doctorId", "name email")
      .populate("appointmentId", "date status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Prescription.countDocuments(filter),
  ]);

  ApiResponse.success(res, {
    prescriptions,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// @desc    Get single prescription
// @route   GET /api/v1/prescriptions/:id
// @access  admin, doctor (own), patient (own)
const getPrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id)
    .populate("patientId", "name age gender contact")
    .populate("doctorId", "name email")
    .populate("appointmentId", "date status");

  if (!prescription) {
    throw ApiError.notFound("Prescription not found");
  }

  // Doctor can only view their own prescriptions
  if (
    req.user.role === "doctor" &&
    prescription.doctorId._id.toString() !== req.user._id.toString()
  ) {
    throw ApiError.forbidden("Access denied");
  }

  // Patient can only view their own prescriptions
  if (req.user.role === "patient") {
    const myPatient = await Patient.findOne({ userId: req.user._id });
    if (
      !myPatient ||
      prescription.patientId._id.toString() !== myPatient._id.toString()
    ) {
      throw ApiError.forbidden("Access denied");
    }
  }

  ApiResponse.success(res, { prescription });
});

module.exports = { createPrescription, getPrescriptions, getPrescription };
