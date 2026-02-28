import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatientApi, updatePatientApi } from "../../api/patientApi";
import { useAuth } from "../../context/AuthContext";
import SidebarIcon from "../../components/icons/SidebarIcon";
import toast from "react-hot-toast";

const PatientProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const canEdit = ["admin", "receptionist"].includes(user?.role);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getPatientApi(id);
        setPatient(data.data.patient);
        setForm({
          name: data.data.patient.name,
          age: data.data.patient.age,
          gender: data.data.patient.gender,
          contact: data.data.patient.contact,
        });
      } catch (err) {
        toast.error(err.response?.data?.message || "Patient not found");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await updatePatientApi(id, {
        ...form,
        age: Number(form.age),
      });
      setPatient(data.data.patient);
      setEditing(false);
      toast.success("Patient updated");
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        toast.error(serverErrors.join(", "));
      } else {
        toast.error(err.response?.data?.message || "Update failed");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading patient...</div>;
  }

  if (!patient) return null;

  return (
    <div>
      <div className="dash-page__header">
        <button className="btn btn--secondary btn--sm" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
        <h1 className="dash-page__title" style={{ marginTop: "0.75rem" }}>
          Patient Profile
        </h1>
      </div>

      {/* Profile card */}
      <div className="profile-card">
        <div className="profile-card__header">
          <div className="profile-card__avatar">
            {patient.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="profile-card__name">{patient.name}</h2>
            <span className="profile-card__meta">
              ID: {patient._id} | Registered:{" "}
              {new Date(patient.createdAt).toLocaleDateString()}
            </span>
          </div>
          {canEdit && !editing && (
            <button
              className="btn btn--primary btn--sm"
              style={{ marginLeft: "auto" }}
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <div className="form-grid" style={{ marginTop: "1.5rem" }}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                className="form-input"
                min="0"
                max="150"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="form-input"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Contact</label>
              <input
                type="text"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-actions">
              <button
                className="btn btn--primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                className="btn btn--secondary"
                onClick={() => {
                  setEditing(false);
                  setForm({
                    name: patient.name,
                    age: patient.age,
                    gender: patient.gender,
                    contact: patient.contact,
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-details">
            <div className="profile-detail">
              <span className="profile-detail__label">Age</span>
              <span className="profile-detail__value">{patient.age} years</span>
            </div>
            <div className="profile-detail">
              <span className="profile-detail__label">Gender</span>
              <span className="profile-detail__value"
                style={{ textTransform: "capitalize" }}
              >
                {patient.gender}
              </span>
            </div>
            <div className="profile-detail">
              <span className="profile-detail__label">Contact</span>
              <span className="profile-detail__value">{patient.contact}</span>
            </div>
            <div className="profile-detail">
              <span className="profile-detail__label">Registered By</span>
              <span className="profile-detail__value">
                {patient.createdBy?.name || "—"} ({patient.createdBy?.role || "—"})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Medical history placeholder */}
      <div style={{ marginTop: "2rem" }}>
        <h2 className="dash-page__title" style={{ fontSize: "1.15rem", marginBottom: "1rem" }}>
          Medical History
        </h2>
        <div className="placeholder-section">
          <div className="placeholder-section__icon">
            <SidebarIcon name="chart-bar" size={48} />
          </div>
          <div className="placeholder-section__title">No Medical Records Yet</div>
          <p className="placeholder-section__text">
            Diagnoses, prescriptions, and visit history will appear here once
            available.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
