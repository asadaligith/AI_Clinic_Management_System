import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createAppointmentApi,
  getDoctorsApi,
  getPatientsApi,
} from "../../api/appointmentApi";
import toast from "react-hot-toast";

const BookAppointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patientSearch, setPatientSearch] = useState("");
  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    reason: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docRes, patRes] = await Promise.all([
          getDoctorsApi(),
          getPatientsApi({ limit: 100 }),
        ]);
        setDoctors(docRes.data.data.doctors);
        setPatients(patRes.data.data.patients);
      } catch {
        toast.error("Failed to load doctors or patients");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const searchPatients = async (query) => {
    setPatientSearch(query);
    if (!query.trim()) return;
    try {
      const { data } = await getPatientsApi({ search: query, limit: 20 });
      setPatients(data.data.patients);
    } catch {
      // keep existing list
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.patientId) errs.patientId = "Select a patient";
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
      await createAppointmentApi(form);
      toast.success("Appointment booked successfully");
      navigate("/receptionist/appointments");
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      toast.error(
        serverErrors ? serverErrors.join(", ") : err.response?.data?.message || "Booking failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div className="loading">Loading doctors & patients...</div>;
  }

  return (
    <div>
      <div className="dash-page__header">
        <h1 className="dash-page__title">Book Appointment</h1>
        <p className="dash-page__subtitle">
          Schedule a patient visit with an available doctor.
        </p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            {/* Patient */}
            <div className="form-group">
              <label className="form-label">Patient</label>
              <input
                type="text"
                placeholder="Search patient by name..."
                value={patientSearch}
                onChange={(e) => searchPatients(e.target.value)}
                className="form-input"
                style={{ marginBottom: "0.35rem" }}
              />
              <select
                name="patientId"
                value={form.patientId}
                onChange={handleChange}
                className={`form-input ${errors.patientId ? "form-input--error" : ""}`}
              >
                <option value="">Select patient</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} — {p.gender}, {p.age}y
                  </option>
                ))}
              </select>
              {errors.patientId && (
                <span className="form-error">{errors.patientId}</span>
              )}
            </div>

            {/* Doctor */}
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

            {/* Date */}
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

            {/* Reason */}
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
              onClick={() =>
                setForm({ patientId: "", doctorId: "", date: "", reason: "" })
              }
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
