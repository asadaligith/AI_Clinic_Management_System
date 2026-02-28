const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, _next) => {
  let error = { ...err, message: err.message };

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    error = ApiError.badRequest(`Duplicate value for: ${field}`);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = ApiError.badRequest("Validation failed", messages);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = ApiError.unauthorized("Invalid token");
  }
  if (err.name === "TokenExpiredError") {
    error = ApiError.unauthorized("Token expired");
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  if (process.env.NODE_ENV === "development") {
    console.error("ERROR:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(error.errors && { errors: error.errors }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
