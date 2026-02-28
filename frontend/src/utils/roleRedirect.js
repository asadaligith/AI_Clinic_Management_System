const ROLE_DASHBOARDS = {
  admin: "/admin/dashboard",
  doctor: "/doctor/dashboard",
  receptionist: "/receptionist/dashboard",
  patient: "/patient/dashboard",
};

export const getDashboardPath = (role) => ROLE_DASHBOARDS[role] || "/dashboard";
