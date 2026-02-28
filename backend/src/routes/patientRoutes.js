const express = require("express");
const {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
} = require("../controllers/patientController");
const { protect, authorize } = require("../middleware/auth");
const {
  createPatientRules,
  updatePatientRules,
} = require("../middleware/validate");

const router = express.Router();

// All patient routes require authentication
router.use(protect);

router
  .route("/")
  .post(authorize("receptionist", "admin"), createPatientRules, createPatient)
  .get(authorize("admin", "doctor", "receptionist"), getPatients);

router
  .route("/:id")
  .get(authorize("admin", "doctor", "receptionist"), getPatient)
  .put(authorize("receptionist", "admin"), updatePatientRules, updatePatient);

module.exports = router;
