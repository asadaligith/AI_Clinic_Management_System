import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Dashboard</h1>
      <p style={styles.subtitle}>
        Welcome, <strong>{user?.name}</strong> | Plan:{" "}
        <span style={styles.badge}>{user?.subscriptionPlan}</span>
      </p>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Users</h3>
          <p>Manage doctors, receptionists & patients</p>
        </div>
        <div style={styles.card}>
          <h3>Subscriptions</h3>
          <p>Monitor plans & billing</p>
        </div>
        <div style={styles.card}>
          <h3>System Settings</h3>
          <p>Configure clinic parameters</p>
        </div>
        <div style={styles.card}>
          <h3>Reports</h3>
          <p>Analytics & audit logs</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  subtitle: { marginTop: "0.5rem", color: "#555" },
  badge: {
    background: "#00d2ff",
    color: "#fff",
    padding: "2px 10px",
    borderRadius: "12px",
    fontSize: "0.8rem",
    textTransform: "uppercase",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1.2rem",
    marginTop: "2rem",
  },
  card: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    borderLeft: "4px solid #16213e",
  },
};

export default AdminDashboard;
