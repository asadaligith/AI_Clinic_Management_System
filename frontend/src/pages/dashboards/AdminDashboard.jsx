import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="dash-page__header">
        <h1 className="dash-page__title">Admin Dashboard</h1>
        <p className="dash-page__subtitle">
          Welcome back, {user?.name}. Here's your clinic overview.
        </p>
      </div>

      {/* Stat cards */}
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

      {/* Quick actions */}
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

const stats = [
  { label: "Total Doctors",       value: "—", bg: "#2ecc71", emoji: "👨‍⚕️" },
  { label: "Total Patients",      value: "—", bg: "#9b59b6", emoji: "🏥" },
  { label: "Appointments Today",  value: "—", bg: "#3498db", emoji: "📅" },
  { label: "Active Subscriptions",value: "—", bg: "#f39c12", emoji: "💳" },
];

export default AdminDashboard;
