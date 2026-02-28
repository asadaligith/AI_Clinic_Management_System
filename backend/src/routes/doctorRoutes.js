const express = require("express");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

// @desc    Get active doctors list
// @route   GET /api/v1/doctors
// @access  admin, receptionist, patient
router.get(
  "/",
  authorize("admin", "receptionist", "patient"),
  asyncHandler(async (_req, res) => {
    const doctors = await User.find({ role: "doctor", isActive: true }).select(
      "name email createdAt"
    );
    ApiResponse.success(res, { doctors });
  })
);

module.exports = router;
