import { useAuth } from "../../context/AuthContext";

const DoctorDashboard = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Doctor Dashboard</h1>
      <p style={styles.subtitle}>
        Welcome, Dr. <strong>{user?.name}</strong> | Plan:{" "}
        <span style={styles.badge}>{user?.subscriptionPlan}</span>
      </p>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Appointments</h3>
          <p>View today's schedule</p>
        </div>
        <div style={styles.card}>
          <h3>Patients</h3>
          <p>Patient records & history</p>
        </div>
        <div style={styles.card}>
          <h3>AI Diagnosis</h3>
          <p>Smart diagnosis assistant</p>
        </div>
        <div style={styles.card}>
          <h3>Prescriptions</h3>
          <p>Write & manage prescriptions</p>
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
    borderLeft: "4px solid #2ecc71",
  },
};

export default DoctorDashboard;
