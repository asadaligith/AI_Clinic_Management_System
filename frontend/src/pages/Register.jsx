import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerApi } from "../api/authApi";
import { getDashboardPath } from "../utils/roleRedirect";
import toast from "react-hot-toast";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerApi(form);
      login(data.data.user, data.data.token);
      toast.success("Registration successful");
      navigate(getDashboardPath(data.data.user.role));
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={{ margin: 0 }}>Patient Registration</h2>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>
          Create your patient account to book appointments
        </p>
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Password (min 6 chars)"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={{
          ...styles.btn,
          opacity: loading ? 0.7 : 1,
        }}>
          {loading ? "Registering..." : "Create Account"}
        </button>
        <p style={{ marginTop: "1rem", fontSize: "0.9rem", textAlign: "center" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <div style={styles.infoBox}>
          <strong>Doctor or Receptionist?</strong><br />
          Your account is created by the clinic admin. Please contact administration.
        </div>
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
  infoBox: {
    padding: "0.75rem 1rem",
    background: "#f0f3ff",
    border: "1px solid #d0d8f0",
    borderRadius: "6px",
    fontSize: "0.8rem",
    color: "#444",
    lineHeight: 1.5,
  },
};

export default Register;
