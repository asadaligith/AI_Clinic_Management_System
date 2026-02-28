import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DoctorDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="dash-page__header">
        <h1 className="dash-page__title">Doctor Dashboard</h1>
        <p className="dash-page__subtitle">
          Good day, Dr. {user?.name}. Here's your schedule overview.
        </p>
      </div>

      <div className="stat-grid">
        {stats.map((s) => (
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
      </div>
    </div>
  );
};

const stats = [
  { label: "Today's Appointments", value: "—", bg: "#3498db", emoji: "📅" },
  { label: "Total Patients",       value: "—", bg: "#2ecc71", emoji: "👥" },
  { label: "Pending Reports",      value: "—", bg: "#e67e22", emoji: "📋" },
];

export default DoctorDashboard;
