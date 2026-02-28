const express = require("express");
const ApiResponse = require("../utils/ApiResponse");

const router = express.Router();

router.get("/", (_req, res) => {
  ApiResponse.success(res, {
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }, "Server is healthy");
});

module.exports = router;
