import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyProfileApi, updateMyProfileApi } from "../../api/patientApi";
import toast from "react-hot-toast";

const MyProfile = () => {
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", gender: "", contact: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getMyProfileApi();
        const p = data.data.patient;
        setPatient(p);
        setForm({
          name: p.name || "",
          age: p.age || "",
          gender: p.gender || "",
          contact: p.contact || "",
        });
        // Auto-open edit if profile is incomplete
        if (!p.age || !p.gender || !p.contact) {
          setEditing(true);
        }
      } catch {
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.age) return toast.error("Age is required");
    if (!form.gender) return toast.error("Gender is required");
    if (!form.contact.trim()) return toast.error("Contact is required");

    setSaving(true);
    try {
      const { data } = await updateMyProfileApi({
        ...form,
        age: Number(form.age),
      });
      setPatient(data.data.patient);
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const isIncomplete = patient && (!patient.age || !patient.gender || !patient.contact);

  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    <div>
      <div className="dash-page__header">
        <h1 className="dash-page__title">My Profile</h1>
        <p className="dash-page__subtitle">Your personal and medical information.</p>
      </div>

      {!patient ? (
        <div className="placeholder-section">
          <div className="placeholder-section__title">Profile Not Found</div>
          <p className="placeholder-section__text">
            Your account is not linked to a patient record yet.
            Please visit the reception desk to complete your registration.
          </p>
        </div>
      ) : editing ? (
        <div className="form-card">
          {isIncomplete && (
            <div style={{
              padding: "0.75rem 1rem",
              background: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: 6,
              marginBottom: "1.25rem",
              fontSize: "0.9rem",
              color: "#856404",
            }}>
              Please complete your profile to book appointments.
            </div>
          )}
          <form onSubmit={handleSave} noValidate>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  className="form-input" placeholder="Your full name" />
              </div>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input type="number" name="age" value={form.age} onChange={handleChange}
                  className="form-input" placeholder="e.g. 28" min="0" max="150" />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} className="form-input">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input type="text" name="contact" value={form.contact} onChange={handleChange}
                  className="form-input" placeholder="+92 300 1234567" />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
              {!isIncomplete && (
                <button type="button" className="btn btn--secondary" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="profile-card">
          <div className="profile-card__header">
            <div className="profile-card__avatar">
              {patient.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="profile-card__name">{patient.name}</h2>
              <p className="profile-card__meta">
                {patient.gender?.charAt(0).toUpperCase() + patient.gender?.slice(1)}, {patient.age} years old
              </p>
            </div>
          </div>

          <div className="profile-details">
            <div className="profile-detail">
              <span className="profile-detail__label">Email</span>
              <span className="profile-detail__value">{user?.email || patient.email || "Not provided"}</span>
            </div>
            <div className="profile-detail">
              <span className="profile-detail__label">Contact</span>
              <span className="profile-detail__value">{patient.contact || "Not provided"}</span>
            </div>
            <div className="profile-detail">
              <span className="profile-detail__label">Registered</span>
              <span className="profile-detail__value">
                {new Date(patient.createdAt).toLocaleDateString("en-US", {
                  month: "long", day: "numeric", year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div style={{ marginTop: "1.25rem" }}>
            <button className="btn btn--secondary" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
