import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDashboardStatsApi } from "../../api/statsApi";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getDashboardStatsApi();
        setStats(data.data.stats);
      } catch {
        toast.error("Failed to load dashboard stats");
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Doctors",       value: stats?.totalDoctors ?? "...",       bg: "#2ecc71", emoji: "\uD83D\uDC68\u200D\u2695\uFE0F" },
    { label: "Total Patients",      value: stats?.totalPatients ?? "...",      bg: "#9b59b6", emoji: "\uD83C\uDFE5" },
    { label: "Appointments Today",  value: stats?.appointmentsToday ?? "...",  bg: "#3498db", emoji: "\uD83D\uDCC5" },
    { label: "Total Appointments",  value: stats?.totalAppointments ?? "...",  bg: "#f39c12", emoji: "\uD83D\uDCCB" },
  ];

  return (
    <div>
      <div className="dash-page__header">
        <h1 className="dash-page__title">Admin Dashboard</h1>
        <p className="dash-page__subtitle">
          Welcome back, {user?.name}. Here's your clinic overview.
        </p>
      </div>

      <div className="stat-grid">
        {statCards.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-card__icon" style={{ background: s.bg }}>
              {s.emoji}
            </div>
            <div className="stat-card__value">{s.value}</div>
            <div className="stat-card__label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dash-page__header">
        <h2 className="dash-page__title" style={{ fontSize: "1.15rem" }}>
          Quick Actions
        </h2>
      </div>
      <div className="action-grid">
        <Link to="/admin/manage-doctors" className="action-card">
          <div className="action-card__title">Manage Doctors</div>
          <div className="action-card__desc">
            Add, edit, or deactivate doctor accounts
          </div>
        </Link>
        <Link to="/admin/manage-receptionists" className="action-card">
          <div className="action-card__title">Manage Receptionists</div>
          <div className="action-card__desc">
            Handle receptionist roles and permissions
          </div>
        </Link>
        <Link to="/admin/system-stats" className="action-card">
          <div className="action-card__title">System Stats</div>
          <div className="action-card__desc">
            View analytics, logs, and system health
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
