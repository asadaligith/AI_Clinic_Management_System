const User = require("../models/User");
const Patient = require("../models/Patient");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  subscriptionPlan: user.subscriptionPlan,
  createdAt: user.createdAt,
});

// @desc    Register a new patient account (public)
// @route   POST /api/v1/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.badRequest("Email already registered");
  }

  // Public registration is patient-only
  const user = await User.create({ name, email, password, role: "patient" });

  // Auto-create linked Patient record so patient can book appointments
  await Patient.create({
    name,
    email,
    userId: user._id,
    createdBy: user._id,
  });

  const token = user.generateToken();

  ApiResponse.created(
    res,
    { user: sanitizeUser(user), token },
    "Registration successful"
  );
});

// @desc    Login user
// @route   POST /api/v1/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  if (!user.isActive) {
    throw ApiError.forbidden("Account has been deactivated");
  }

  const token = user.generateToken();

  ApiResponse.success(
    res,
    { user: sanitizeUser(user), token },
    "Login successful"
  );
});

// @desc    Get current logged-in user
// @route   GET /api/v1/auth/me
const getMe = asyncHandler(async (req, res) => {
  ApiResponse.success(res, { user: sanitizeUser(req.user) });
});

module.exports = { register, login, getMe };
