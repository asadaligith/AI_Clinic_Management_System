import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerApi } from "../api/authApi";
import toast from "react-hot-toast";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Register</h2>
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
        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? "Registering..." : "Register"}
        </button>
        <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
          Already have an account? <Link to="/login">Login</Link>
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
    width: 360,
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
};

export default Register;
