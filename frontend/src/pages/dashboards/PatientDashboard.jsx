import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PatientDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="dash-page__header">
        <h1 className="dash-page__title">Patient Dashboard</h1>
        <p className="dash-page__subtitle">
          Welcome, {user?.name}. Manage your health in one place.
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

const stats = [
  { label: "Upcoming Visits",   value: "—", bg: "#9b59b6", emoji: "📅" },
  { label: "Prescriptions",     value: "—", bg: "#2ecc71", emoji: "💊" },
  { label: "Reports Available", value: "—", bg: "#3498db", emoji: "📄" },
];

export default PatientDashboard;
