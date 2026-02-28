import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

// Dashboard overviews
import AdminDashboard from "../pages/dashboards/AdminDashboard";
import DoctorDashboard from "../pages/dashboards/DoctorDashboard";
import ReceptionistDashboard from "../pages/dashboards/ReceptionistDashboard";
import PatientDashboard from "../pages/dashboards/PatientDashboard";

// Admin sub-pages
import ManageDoctors from "../pages/admin/ManageDoctors";
import ManageReceptionists from "../pages/admin/ManageReceptionists";
import SystemStats from "../pages/admin/SystemStats";

// Receptionist sub-pages
import RegisterPatient from "../pages/receptionist/RegisterPatient";
import BookAppointment from "../pages/receptionist/BookAppointment";

// Doctor sub-pages
import CreatePrescription from "../pages/doctor/CreatePrescription";
import PrescriptionList from "../pages/doctor/PrescriptionList";

// Patient sub-pages
import MyProfile from "../pages/patient/MyProfile";
import MyAppointments from "../pages/patient/MyAppointments";
import MyPrescriptions from "../pages/patient/MyPrescriptions";

// Shared pages
import PatientList from "../pages/shared/PatientList";
import PatientProfile from "../pages/shared/PatientProfile";
import AppointmentList from "../pages/shared/AppointmentList";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ---- Public pages (with Navbar) ---- */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Generic /dashboard -> role redirect */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* ---- Admin dashboard ---- */}
      <Route
        element={
          <RoleRoute roles={["admin"]}>
            <DashboardLayout />
          </RoleRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-doctors" element={<ManageDoctors />} />
        <Route path="/admin/manage-receptionists" element={<ManageReceptionists />} />
        <Route path="/admin/patients" element={<PatientList />} />
        <Route path="/admin/patients/:id" element={<PatientProfile />} />
        <Route path="/admin/appointments" element={<AppointmentList />} />
        <Route path="/admin/system-stats" element={<SystemStats />} />
      </Route>

      {/* ---- Doctor dashboard ---- */}
      <Route
        element={
          <RoleRoute roles={["admin", "doctor"]}>
            <DashboardLayout />
          </RoleRoute>
        }
      >
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<AppointmentList />} />
        <Route path="/doctor/patients" element={<PatientList />} />
        <Route path="/doctor/patients/:id" element={<PatientProfile />} />
        <Route path="/doctor/prescriptions" element={<PrescriptionList />} />
        <Route path="/doctor/create-prescription/:appointmentId" element={<CreatePrescription />} />
      </Route>

      {/* ---- Receptionist dashboard ---- */}
      <Route
        element={
          <RoleRoute roles={["admin", "receptionist"]}>
            <DashboardLayout />
          </RoleRoute>
        }
      >
        <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
        <Route path="/receptionist/register-patient" element={<RegisterPatient />} />
        <Route path="/receptionist/patients" element={<PatientList />} />
        <Route path="/receptionist/patients/:id" element={<PatientProfile />} />
        <Route path="/receptionist/book-appointment" element={<BookAppointment />} />
        <Route path="/receptionist/appointments" element={<AppointmentList />} />
      </Route>

      {/* ---- Patient dashboard ---- */}
      <Route
        element={
          <RoleRoute roles={["admin", "patient"]}>
            <DashboardLayout />
          </RoleRoute>
        }
      >
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/profile" element={<MyProfile />} />
        <Route path="/patient/appointments" element={<MyAppointments />} />
        <Route path="/patient/prescriptions" element={<MyPrescriptions />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
