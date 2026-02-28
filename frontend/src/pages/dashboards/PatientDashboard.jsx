import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDashboardStatsApi } from "../../api/statsApi";
import toast from "react-hot-toast";

const PatientDashboard = () => {
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
    { label: "Upcoming Visits",      value: stats?.upcomingVisits ?? "...",      bg: "#9b59b6", emoji: "\uD83D\uDCC5" },
    { label: "Total Appointments",   value: stats?.totalAppointments ?? "...",   bg: "#3498db", emoji: "\uD83D\uDCCB" },
    { label: "Completed Visits",     value: stats?.completedVisits ?? "...",     bg: "#2ecc71", emoji: "\u2705" },
  ];

  return (
    <div>
      <div className="dash-page__header">
        <h1 className="dash-page__title">Patient Dashboard</h1>
        <p className="dash-page__subtitle">
          Welcome, {user?.name}. Manage your health in one place.
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
        <Link to="/patient/book-appointment" className="action-card">
          <div className="action-card__title">Book Appointment</div>
          <div className="action-card__desc">
            Schedule a visit with an available doctor
          </div>
        </Link>
        <Link to="/patient/profile" className="action-card">
          <div className="action-card__title">My Profile</div>
          <div className="action-card__desc">
            View and update your personal details
          </div>
        </Link>
        <Link to="/patient/appointments" className="action-card">
          <div className="action-card__title">My Appointments</div>
          <div className="action-card__desc">
            View scheduled and past appointments
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PatientDashboard;
