const express = require("express");
const { getUsers, updateUser } = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.get("/users", getUsers);
router.put("/users/:id", updateUser);

module.exports = router;
