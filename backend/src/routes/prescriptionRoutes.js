const express = require("express");
const {
  createPrescription,
  getPrescriptions,
  getPrescription,
} = require("../controllers/prescriptionController");
const { protect, authorize } = require("../middleware/auth");
const { createPrescriptionRules } = require("../middleware/validate");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(authorize("doctor"), createPrescriptionRules, createPrescription)
  .get(authorize("admin", "doctor", "patient"), getPrescriptions);

router
  .route("/:id")
  .get(authorize("admin", "doctor", "patient"), getPrescription);

module.exports = router;
