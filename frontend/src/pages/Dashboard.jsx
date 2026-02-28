import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p style={{ marginTop: "0.5rem", color: "#555" }}>
        Welcome back, <strong>{user?.name}</strong> ({user?.role})
      </p>
    </div>
  );
};

export default Dashboard;
