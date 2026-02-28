const sidebarMenus = {
  admin: [
    { label: "Dashboard",           path: "/admin/dashboard",             icon: "grid"       },
    { label: "Manage Doctors",      path: "/admin/manage-doctors",        icon: "user-md"    },
    { label: "Manage Receptionists",path: "/admin/manage-receptionists",  icon: "user-cog"   },
    { label: "All Patients",        path: "/admin/patients",              icon: "users"      },
    { label: "Appointments",        path: "/admin/appointments",          icon: "calendar"   },
    { label: "System Stats",        path: "/admin/system-stats",          icon: "chart-bar"  },
  ],
  doctor: [
    { label: "Dashboard",      path: "/doctor/dashboard",      icon: "grid"      },
    { label: "Appointments",   path: "/doctor/appointments",   icon: "calendar"  },
    { label: "My Patients",    path: "/doctor/patients",        icon: "users"     },
    { label: "Prescriptions",  path: "/doctor/prescriptions",   icon: "clipboard" },
  ],
  receptionist: [
    { label: "Dashboard",        path: "/receptionist/dashboard",        icon: "grid"       },
    { label: "Register Patient", path: "/receptionist/register-patient", icon: "user-plus"  },
    { label: "Patients",         path: "/receptionist/patients",         icon: "users"      },
    { label: "Book Appointment", path: "/receptionist/book-appointment", icon: "calendar"   },
    { label: "Appointments",     path: "/receptionist/appointments",     icon: "calendar"   },
  ],
  patient: [
    { label: "Dashboard",        path: "/patient/dashboard",         icon: "grid"      },
    { label: "My Appointments",  path: "/patient/appointments",      icon: "calendar"  },
    { label: "Prescriptions",    path: "/patient/prescriptions",     icon: "clipboard" },
    { label: "My Profile",       path: "/patient/profile",           icon: "user"      },
  ],
};

export default sidebarMenus;
