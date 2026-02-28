const ROLES = {
  ADMIN: "admin",
  DOCTOR: "doctor",
  RECEPTIONIST: "receptionist",
  PATIENT: "patient",
};

const SUBSCRIPTION_PLANS = {
  FREE: "free",
  PRO: "pro",
};

const APPOINTMENT_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

const TOKEN_EXPIRY = process.env.JWT_EXPIRE || "7d";

module.exports = { ROLES, SUBSCRIPTION_PLANS, APPOINTMENT_STATUS, TOKEN_EXPIRY };
