import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createAppointmentApi, getDoctorsApi } from "../../api/appointmentApi";
import toast from "react-hot-toast";

const BookAppointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ doctorId: "", date: "", reason: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await getDoctorsApi();
        setDoctors(data.data.doctors);
      } catch {
        toast.error("Failed to load doctors");
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.doctorId) errs.doctorId = "Select a doctor";
    if (!form.date) errs.date = "Select date and time";
    else if (new Date(form.date) < new Date()) errs.date = "Date must be in the future";
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
      // Patient role: no patientId needed, backend auto-resolves
      await createAppointmentApi({
        doctorId: form.doctorId,
        date: form.date,
        reason: form.reason,
      });
      toast.success("Appointment booked successfully");
      navigate("/patient/appointments");
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      toast.error(
        serverErrors ? serverErrors.join(", ") : err.response?.data?.message || "Booking failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingDoctors) {
    return <div className="loading">Loading doctors...</div>;
  }

  return (
    <div>
      <div className="dash-page__header">
        <h1 className="dash-page__title">Book Appointment</h1>
        <p className="dash-page__subtitle">
          Schedule a visit with an available doctor.
        </p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Doctor</label>
              <select
                name="doctorId"
                value={form.doctorId}
                onChange={handleChange}
                className={`form-input ${errors.doctorId ? "form-input--error" : ""}`}
              >
                <option value="">Select doctor</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    Dr. {d.name}
                  </option>
                ))}
              </select>
              {errors.doctorId && (
                <span className="form-error">{errors.doctorId}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Date & Time</label>
              <input
                type="datetime-local"
                name="date"
                value={form.date}
                onChange={handleChange}
                className={`form-input ${errors.date ? "form-input--error" : ""}`}
              />
              {errors.date && <span className="form-error">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Reason (optional)</label>
              <input
                type="text"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. Follow-up, General checkup"
                maxLength={500}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? "Booking..." : "Book Appointment"}
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setForm({ doctorId: "", date: "", reason: "" })}
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
