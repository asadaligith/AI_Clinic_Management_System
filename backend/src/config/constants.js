const ROLES = {
  ADMIN: "admin",
  DOCTOR: "doctor",
  RECEPTIONIST: "receptionist",
  PATIENT: "patient",
};

const TOKEN_EXPIRY = process.env.JWT_EXPIRE || "7d";

module.exports = { ROLES, TOKEN_EXPIRY };
