const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Protect routes - verify JWT token.
 */
const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw ApiError.unauthorized("Not authorized, no token provided");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    throw ApiError.unauthorized("User not found or deactivated");
  }

  req.user = user;
  next();
});

/**
 * Authorize by role(s).
 * Usage: authorize("admin", "doctor")
 */
const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `Role '${req.user.role}' is not authorized to access this route`
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
