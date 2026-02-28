/**
 * Standardized API response helper.
 */
class ApiResponse {
  static success(res, data = null, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, data = null, message = "Created successfully") {
    return ApiResponse.success(res, data, message, 201);
  }

  static error(res, message = "Something went wrong", statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(errors && { errors }),
    });
  }
}

module.exports = ApiResponse;
