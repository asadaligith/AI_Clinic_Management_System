const express = require("express");
const {
  createDoctor,
  createReceptionist,
  getUsers,
  updateUser,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");
const { adminCreateUserRules } = require("../middleware/validate");

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.post("/doctors", adminCreateUserRules, createDoctor);
router.post("/receptionists", adminCreateUserRules, createReceptionist);
router.get("/users", getUsers);
router.put("/users/:id", updateUser);

module.exports = router;
