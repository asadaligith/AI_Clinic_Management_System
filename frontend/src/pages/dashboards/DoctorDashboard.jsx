import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDashboardStatsApi } from "../../api/statsApi";
import toast from "react-hot-toast";

const DoctorDashboard = () => {
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
    { label: "Today's Appointments", value: stats?.todaysAppointments ?? "...", bg: "#3498db", emoji: "\uD83D\uDCC5" },
    { label: "Total Patients",       value: stats?.totalPatients ?? "...",       bg: "#2ecc71", emoji: "\uD83D\uDC65" },
    { label: "Pending Reviews",      value: stats?.pendingAppointments ?? "...", bg: "#e67e22", emoji: "\uD83D\uDCCB" },
    { label: "Prescriptions",        value: stats?.totalPrescriptions ?? "...", bg: "#9b59b6", emoji: "\uD83D\uDCDD" },
  ];

  return (
    <div>
      <div className="dash-page__header">
        <h1 className="dash-page__title">Doctor Dashboard</h1>
        <p className="dash-page__subtitle">
          Good day, Dr. {user?.name}. Here's your schedule overview.
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
        <Link to="/doctor/appointments" className="action-card">
          <div className="action-card__title">View Appointments</div>
          <div className="action-card__desc">
            Check today's and upcoming appointments
          </div>
        </Link>
        <Link to="/doctor/patients" className="action-card">
          <div className="action-card__title">View Patients</div>
          <div className="action-card__desc">
            Access patient records and medical history
          </div>
        </Link>
        <Link to="/doctor/prescriptions" className="action-card">
          <div className="action-card__title">Prescriptions</div>
          <div className="action-card__desc">
            View all prescriptions you have created
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DoctorDashboard;
