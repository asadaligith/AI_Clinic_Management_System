import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginApi } from "../api/authApi";
import { getDashboardPath } from "../utils/roleRedirect";
import toast from "react-hot-toast";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await loginApi(form);
      login(data.data.user, data.data.token);
      toast.success("Login successful");
      navigate(getDashboardPath(data.data.user.role));
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={{ margin: 0 }}>Login</h2>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>
          Enter your credentials to access the dashboard
        </p>

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            ...styles.input,
            borderColor: error ? "#e74c3c" : "#ddd",
          }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{
            ...styles.input,
            borderColor: error ? "#e74c3c" : "#ddd",
          }}
        />
        <button type="submit" disabled={loading} style={{
          ...styles.btn,
          opacity: loading ? 0.7 : 1,
        }}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p style={{ marginTop: "1rem", fontSize: "0.9rem", textAlign: "center" }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: { display: "flex", justifyContent: "center", padding: "3rem" },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: 380,
    padding: "2rem",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  input: {
    padding: "0.7rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  btn: {
    padding: "0.7rem",
    background: "#16213e",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  errorBox: {
    padding: "0.75rem 1rem",
    background: "#fdeaea",
    border: "1px solid #e74c3c",
    borderRadius: "6px",
    color: "#c0392b",
    fontSize: "0.875rem",
  },
};

export default Login;
