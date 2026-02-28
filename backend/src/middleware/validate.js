const { body, validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");
const { ROLES } = require("../config/constants");

/**
 * Runs validation result check after express-validator rules.
 */
const handleValidation = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    throw ApiError.badRequest("Validation failed", messages);
  }
  next();
};

const registerRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage(`Role must be one of: ${Object.values(ROLES).join(", ")}`),
  handleValidation,
];

const loginRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidation,
];

const createPatientRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Patient name is required")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
  body("age")
    .notEmpty()
    .withMessage("Age is required")
    .isInt({ min: 0, max: 150 })
    .withMessage("Age must be between 0 and 150"),
  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),
  body("contact")
    .trim()
    .notEmpty()
    .withMessage("Contact number is required")
    .matches(/^\+?[\d\s-]{7,15}$/)
    .withMessage("Please enter a valid contact number (7-15 digits)"),
  body("email")
    .optional({ values: "falsy" })
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  body("password")
    .optional({ values: "falsy" })
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  handleValidation,
];

const updatePatientRules = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
  body("age")
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage("Age must be between 0 and 150"),
  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),
  body("contact")
    .optional()
    .trim()
    .matches(/^\+?[\d\s-]{7,15}$/)
    .withMessage("Please enter a valid contact number (7-15 digits)"),
  handleValidation,
];

const createAppointmentRules = [
  body("patientId")
    .optional()
    .isMongoId()
    .withMessage("Invalid patient ID"),
  body("doctorId")
    .notEmpty()
    .withMessage("Doctor is required")
    .isMongoId()
    .withMessage("Invalid doctor ID"),
  body("date")
    .notEmpty()
    .withMessage("Appointment date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("reason")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Reason cannot exceed 500 characters"),
  handleValidation,
];

const updateStatusRules = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "confirmed", "completed", "cancelled"])
    .withMessage("Status must be pending, confirmed, completed, or cancelled"),
  handleValidation,
];

module.exports = {
  registerRules,
  loginRules,
  createPatientRules,
  updatePatientRules,
  createAppointmentRules,
  updateStatusRules,
};
