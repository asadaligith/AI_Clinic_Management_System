import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ReceptionistDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="dash-page__header">
        <h1 className="dash-page__title">Receptionist Dashboard</h1>
        <p className="dash-page__subtitle">
          Welcome, {user?.name}. Manage front-desk operations here.
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

const stats = [
  { label: "Today's Check-ins",    value: "—", bg: "#f39c12", emoji: "📝" },
  { label: "Upcoming Appointments",value: "—", bg: "#3498db", emoji: "📅" },
  { label: "Registered Today",     value: "—", bg: "#2ecc71", emoji: "➕" },
];

export default ReceptionistDashboard;
