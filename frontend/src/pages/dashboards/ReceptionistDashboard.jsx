import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDashboardStatsApi } from "../../api/statsApi";
import toast from "react-hot-toast";

const ReceptionistDashboard = () => {
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
    { label: "Today's Appointments", value: stats?.todaysAppointments ?? "...", bg: "#f39c12", emoji: "\uD83D\uDCDD" },
    { label: "Total Patients",       value: stats?.totalPatients ?? "...",       bg: "#3498db", emoji: "\uD83D\uDCC5" },
    { label: "Registered Today",     value: stats?.registeredToday ?? "...",     bg: "#2ecc71", emoji: "\u2795" },
  ];

  return (
    <div>
      <div className="dash-page__header">
        <h1 className="dash-page__title">Receptionist Dashboard</h1>
        <p className="dash-page__subtitle">
          Welcome, {user?.name}. Manage front-desk operations here.
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
        <Link to="/receptionist/register-patient" className="action-card">
          <div className="action-card__title">Register Patient</div>
          <div className="action-card__desc">
            Add new walk-in or referred patients
          </div>
        </Link>
        <Link to="/receptionist/book-appointment" className="action-card">
          <div className="action-card__title">Book Appointment</div>
          <div className="action-card__desc">
            Schedule patient visits with available doctors
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
