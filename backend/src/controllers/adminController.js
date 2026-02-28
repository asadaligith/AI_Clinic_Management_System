const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

// @desc    Create a doctor user
// @route   POST /api/v1/admin/doctors
// @access  admin
const createDoctor = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.badRequest("Email already registered");
  }

  const user = await User.create({ name, email, password, role: "doctor" });

  ApiResponse.created(
    res,
    { user: sanitizeUser(user) },
    "Doctor created successfully"
  );
});

// @desc    Create a receptionist user
// @route   POST /api/v1/admin/receptionists
// @access  admin
const createReceptionist = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.badRequest("Email already registered");
  }

  const user = await User.create({ name, email, password, role: "receptionist" });

  ApiResponse.created(
    res,
    { user: sanitizeUser(user) },
    "Receptionist created successfully"
  );
});

// @desc    Get all users (with filters + pagination)
// @route   GET /api/v1/admin/users
// @access  admin
const getUsers = asyncHandler(async (req, res) => {
  const { role, search, isActive, page = 1, limit = 10 } = req.query;
  const filter = {};

  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === "true";
  if (search) filter.name = { $regex: search, $options: "i" };

  const skip = (Number(page) - 1) * Number(limit);

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  ApiResponse.success(res, {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// @desc    Update user (toggle active, change role)
// @route   PUT /api/v1/admin/users/:id
// @access  admin
const updateUser = asyncHandler(async (req, res) => {
  const { isActive, role } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    throw ApiError.notFound("User not found");
  }

  if (
    req.user._id.toString() === user._id.toString() &&
    isActive === false
  ) {
    throw ApiError.badRequest("You cannot deactivate your own account");
  }

  if (isActive !== undefined) user.isActive = isActive;
  if (role !== undefined) user.role = role;

  await user.save();

  ApiResponse.success(res, { user: sanitizeUser(user) }, "User updated successfully");
});

module.exports = { createDoctor, createReceptionist, getUsers, updateUser };
