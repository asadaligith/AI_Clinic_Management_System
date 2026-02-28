const express = require("express");
const {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  getMyProfile,
} = require("../controllers/patientController");
const { protect, authorize } = require("../middleware/auth");
const {
  createPatientRules,
  updatePatientRules,
} = require("../middleware/validate");

const router = express.Router();

// All patient routes require authentication
router.use(protect);

// Patient's own profile (must be above /:id to avoid conflict)
router.get("/my-profile", authorize("patient"), getMyProfile);

router
  .route("/")
  .post(authorize("receptionist", "admin"), createPatientRules, createPatient)
  .get(authorize("admin", "doctor", "receptionist"), getPatients);

router
  .route("/:id")
  .get(authorize("admin", "doctor", "receptionist"), getPatient)
  .put(authorize("receptionist", "admin"), updatePatientRules, updatePatient);

module.exports = router;
