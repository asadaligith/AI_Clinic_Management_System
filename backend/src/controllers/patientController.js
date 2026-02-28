const Patient = require("../models/Patient");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// @desc    Create a patient + User account with role="patient"
// @route   POST /api/v1/patients
// @access  receptionist, admin
const createPatient = asyncHandler(async (req, res) => {
  const { name, age, gender, contact, email, password } = req.body;

  // Always create User account for patient login
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.badRequest("Email already registered");
  }

  const userAccount = await User.create({
    name,
    email,
    password,
    role: "patient",
  });

  const patient = await Patient.create({
    name,
    age,
    gender,
    contact,
    email,
    userId: userAccount._id,
    createdBy: req.user._id,
  });

  const populated = await Patient.findById(patient._id).populate(
    "createdBy",
    "name role"
  );

  ApiResponse.created(res, { patient: populated }, "Patient registered successfully");
});

// @desc    Get all patients (search + pagination)
// @route   GET /api/v1/patients
// @access  admin, doctor, receptionist
const getPatients = asyncHandler(async (req, res) => {
  const { search, gender, page = 1, limit = 10 } = req.query;
  const filter = {};

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }
  if (gender) {
    filter.gender = gender;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [patients, total] = await Promise.all([
    Patient.find(filter)
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Patient.countDocuments(filter),
  ]);

  ApiResponse.success(res, {
    patients,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// @desc    Get single patient by ID
// @route   GET /api/v1/patients/:id
// @access  admin, doctor, receptionist
const getPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id).populate(
    "createdBy",
    "name role"
  );

  if (!patient) {
    throw ApiError.notFound("Patient not found");
  }

  ApiResponse.success(res, { patient });
});

// @desc    Update patient
// @route   PUT /api/v1/patients/:id
// @access  receptionist, admin
const updatePatient = asyncHandler(async (req, res) => {
  const { name, age, gender, contact } = req.body;

  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    throw ApiError.notFound("Patient not found");
  }

  if (name !== undefined) patient.name = name;
  if (age !== undefined) patient.age = age;
  if (gender !== undefined) patient.gender = gender;
  if (contact !== undefined) patient.contact = contact;

  await patient.save();

  ApiResponse.success(res, { patient }, "Patient updated successfully");
});

// @desc    Get logged-in patient's own profile
// @route   GET /api/v1/patients/my-profile
// @access  patient
const getMyProfile = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ userId: req.user._id }).populate(
    "createdBy",
    "name role"
  );

  if (!patient) {
    throw ApiError.notFound("No patient profile linked to your account");
  }

  ApiResponse.success(res, { patient });
});

// @desc    Update logged-in patient's own profile
// @route   PUT /api/v1/patients/my-profile
// @access  patient
const updateMyProfile = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ userId: req.user._id });
  if (!patient) {
    throw ApiError.notFound("No patient profile linked to your account");
  }

  const { name, age, gender, contact } = req.body;
  if (name !== undefined) patient.name = name;
  if (age !== undefined) patient.age = age;
  if (gender !== undefined) patient.gender = gender;
  if (contact !== undefined) patient.contact = contact;

  await patient.save();

  ApiResponse.success(res, { patient }, "Profile updated successfully");
});

module.exports = { createPatient, getPatients, getPatient, updatePatient, getMyProfile, updateMyProfile };
