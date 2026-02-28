import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPatientApi } from "../../api/patientApi";
import toast from "react-hot-toast";

const INITIAL = { name: "", age: "", gender: "", contact: "", email: "", password: "" };

const RegisterPatient = () => {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.age) errs.age = "Age is required";
    else if (form.age < 0 || form.age > 150) errs.age = "Age must be 0-150";
    if (!form.gender) errs.gender = "Gender is required";
    if (!form.contact.trim()) errs.contact = "Contact is required";
    else if (!/^\+?[\d\s-]{7,15}$/.test(form.contact))
      errs.contact = "Invalid contact number";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = "Invalid email address";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await createPatientApi({ ...form, age: Number(form.age) });
      toast.success("Patient registered successfully");
      navigate("/receptionist/patients");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to register patient";
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        toast.error(serverErrors.join(", "));
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="dash-page__header">
        <h1 className="dash-page__title">Register New Patient</h1>
        <p className="dash-page__subtitle">
          Fill in patient details. A login account will be created automatically.
        </p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                className={`form-input ${errors.name ? "form-input--error" : ""}`}
                placeholder="Enter patient name" />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Age</label>
              <input type="number" name="age" value={form.age} onChange={handleChange}
                className={`form-input ${errors.age ? "form-input--error" : ""}`}
                placeholder="e.g. 32" min="0" max="150" />
              {errors.age && <span className="form-error">{errors.age}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}
                className={`form-input ${errors.gender ? "form-input--error" : ""}`}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <span className="form-error">{errors.gender}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input type="text" name="contact" value={form.contact} onChange={handleChange}
                className={`form-input ${errors.contact ? "form-input--error" : ""}`}
                placeholder="+92 300 1234567" />
              {errors.contact && <span className="form-error">{errors.contact}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email (for patient login)</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                className={`form-input ${errors.email ? "form-input--error" : ""}`}
                placeholder="patient@example.com" />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password (for patient login)</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                className={`form-input ${errors.password ? "form-input--error" : ""}`}
                placeholder="Min 6 characters" />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? "Registering..." : "Register Patient"}
            </button>
            <button type="button" className="btn btn--secondary"
              onClick={() => setForm(INITIAL)} disabled={loading}>
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPatient;
