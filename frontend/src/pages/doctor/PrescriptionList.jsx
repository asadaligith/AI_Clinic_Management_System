import { useState, useEffect } from "react";
import { getPrescriptionsApi } from "../../api/prescriptionApi";
import toast from "react-hot-toast";

const PrescriptionList = () => {
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
        <h1 className="dash-page__title">Prescriptions</h1>
        <p className="dash-page__subtitle">
          {prescriptions.length} prescription{prescriptions.length !== 1 ? "s" : ""} created
        </p>
      </div>

      {prescriptions.length === 0 ? (
        <div className="placeholder-section">
          <div className="placeholder-section__title">No Prescriptions Yet</div>
          <p className="placeholder-section__text">
            Prescriptions you create for completed appointments will appear here.
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Patient</th>
                <th>Medicines</th>
                <th>Instructions</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((p) => (
                <tr key={p._id}>
                  <td>{formatDate(p.createdAt)}</td>
                  <td className="table-name">{p.patientId?.name || "\u2014"}</td>
                  <td>
                    {p.medicines.map((m, i) => (
                      <div key={i} style={{ marginBottom: i < p.medicines.length - 1 ? 4 : 0 }}>
                        <strong>{m.name}</strong>
                        {m.dosage && <span> &mdash; {m.dosage}</span>}
                        {m.duration && <span> ({m.duration})</span>}
                      </div>
                    ))}
                  </td>
                  <td style={{ maxWidth: 200 }}>
                    <span className="text-truncate">{p.instructions || "\u2014"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PrescriptionList;
