import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyProfileApi } from "../../api/patientApi";
import toast from "react-hot-toast";

const MyProfile = () => {
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getMyProfileApi();
        setPatient(data.data.patient);
      } catch {
        // Patient might not have a linked profile yet
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    <div>
      <div className="dash-page__header">
        <h1 className="dash-page__title">My Profile</h1>
        <p className="dash-page__subtitle">Your personal and medical information.</p>
      </div>

      {!patient ? (
        <div className="placeholder-section">
          <div className="placeholder-section__title">Profile Not Linked</div>
          <p className="placeholder-section__text">
            Your account is not linked to a patient record yet.
            Please visit the reception desk to complete your registration.
          </p>
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
              <span className="profile-detail__value">{patient.contact}</span>
            </div>
            <div className="profile-detail">
              <span className="profile-detail__label">Registered</span>
              <span className="profile-detail__value">
                {new Date(patient.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
