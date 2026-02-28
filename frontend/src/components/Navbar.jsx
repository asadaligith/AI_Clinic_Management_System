import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        AI Clinic
      </Link>
      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <button onClick={handleLogout} style={styles.btn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#16213e",
    color: "#fff",
  },
  brand: { fontSize: "1.4rem", fontWeight: "bold", color: "#00d2ff" },
  links: { display: "flex", gap: "1rem", alignItems: "center" },
  link: { color: "#e0e0e0", fontSize: "0.95rem" },
  btn: {
    background: "#e94560",
    color: "#fff",
    border: "none",
    padding: "0.4rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
};

export default Navbar;
