import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLE_DASHBOARDS = {
  admin: "/admin/dashboard",
  doctor: "/doctor/dashboard",
  receptionist: "/receptionist/dashboard",
  patient: "/patient/dashboard",
};

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const target = ROLE_DASHBOARDS[user.role] || "/";
  return <Navigate to={target} replace />;
};

export default Dashboard;
