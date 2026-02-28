import { useState, useEffect } from "react";
import { getPrescriptionsApi } from "../../api/prescriptionApi";
import toast from "react-hot-toast";

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getPrescriptionsApi();
        setPrescriptions(data.data.prescriptions);
      } catch {
        toast.error("Failed to load prescriptions");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });

  if (loading) return <div className="loading">Loading prescriptions...</div>;

  return (
    <div>
      <div className="dash-page__header">
        <h1 className="dash-page__title">My Prescriptions</h1>
        <p className="dash-page__subtitle">
          {prescriptions.length} prescription{prescriptions.length !== 1 ? "s" : ""}
        </p>
      </div>

      {prescriptions.length === 0 ? (
        <div className="placeholder-section">
          <div className="placeholder-section__title">No Prescriptions Yet</div>
          <p className="placeholder-section__text">
            Prescriptions from your doctor visits will appear here.
          </p>
        </div>
      ) : (
        <div className="appt-cards">
          {prescriptions.map((p) => (
            <div className="appt-card" key={p._id}>
              <div className="appt-card__top">
                <span className="appt-card__date">{formatDate(p.createdAt)}</span>
                <span className="table-badge" style={{ background: "#2ecc71" }}>
                  Prescribed
                </span>
              </div>
              <div className="appt-card__doctor">
                Dr. {p.doctorId?.name || "\u2014"}
              </div>
              <div style={{ marginTop: "0.75rem" }}>
                <strong style={{ fontSize: "0.85rem", color: "#555" }}>Medicines:</strong>
                {p.medicines.map((m, i) => (
                  <div key={i} style={{ fontSize: "0.9rem", marginTop: 4, paddingLeft: 8 }}>
                    {m.name}
                    {m.dosage && <span> &mdash; {m.dosage}</span>}
                    {m.duration && <span> ({m.duration})</span>}
                  </div>
                ))}
              </div>
              {p.instructions && (
                <div className="appt-card__reason" style={{ marginTop: "0.5rem" }}>
                  <strong>Instructions:</strong> {p.instructions}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPrescriptions;
