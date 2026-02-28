const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("./middleware/errorHandler");
const ApiError = require("./utils/ApiError");

// Route imports
const healthRoute = require("./routes/healthRoute");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();

// --------------- Middleware ---------------
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// --------------- Routes ---------------
app.use("/api/v1/health", healthRoute);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/patients", patientRoutes);
app.use("/api/v1/appointments", appointmentRoutes);

// --------------- 404 Handler ---------------
app.all("*", (req) => {
  throw ApiError.notFound(`Route ${req.originalUrl} not found`);
});

// --------------- Global Error Handler ---------------
app.use(errorHandler);

module.exports = app;
