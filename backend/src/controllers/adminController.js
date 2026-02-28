const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

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

  // Prevent admin from deactivating themselves
  if (
    req.user._id.toString() === user._id.toString() &&
    isActive === false
  ) {
    throw ApiError.badRequest("You cannot deactivate your own account");
  }

  if (isActive !== undefined) user.isActive = isActive;
  if (role !== undefined) user.role = role;

  await user.save();

  ApiResponse.success(
    res,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    },
    "User updated successfully"
  );
});

module.exports = { getUsers, updateUser };
