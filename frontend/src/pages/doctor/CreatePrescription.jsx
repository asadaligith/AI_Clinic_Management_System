import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAppointmentsApi } from "../../api/appointmentApi";
import { createPrescriptionApi } from "../../api/prescriptionApi";
import toast from "react-hot-toast";

const CreatePrescription = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [medicines, setMedicines] = useState([{ name: "", dosage: "", duration: "" }]);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const { data } = await getAppointmentsApi({ limit: 100 });
        const found = data.data.appointments.find((a) => a._id === appointmentId);
        if (found) {
          setAppointment(found);
        } else {
          toast.error("Appointment not found");
          navigate("/doctor/appointments");
        }
      } catch {
        toast.error("Failed to load appointment");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [appointmentId, navigate]);

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", duration: "" }]);
  };

  const removeMedicine = (index) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const updateMedicine = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validMedicines = medicines.filter((m) => m.name.trim());
    if (validMedicines.length === 0) {
      toast.error("Add at least one medicine");
      return;
    }

    setSubmitting(true);
    try {
      await createPrescriptionApi({
        appointmentId,
        medicines: validMedicines,
        instructions,
      });
      toast.success("Prescription created successfully");
      navigate("/doctor/prescriptions");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create prescription");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading appointment...</div>;
  if (!appointment) return null;

  return (
    <div>
      <div className="dash-page__header">
        <h1 className="dash-page__title">Create Prescription</h1>
        <p className="dash-page__subtitle">
          For patient: <strong>{appointment.patientId?.name}</strong> |
          Date: {new Date(appointment.date).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          })}
        </p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          {/* Medicines */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label className="form-label" style={{ fontSize: "1rem", marginBottom: "0.75rem", display: "block" }}>
              Medicines
            </label>
            {medicines.map((med, idx) => (
              <div key={idx} className="form-grid" style={{ marginBottom: "0.75rem", alignItems: "flex-end" }}>
                <div className="form-group">
                  {idx === 0 && <label className="form-label">Medicine Name</label>}
                  <input type="text" value={med.name}
                    onChange={(e) => updateMedicine(idx, "name", e.target.value)}
                    className="form-input" placeholder="e.g. Amoxicillin" />
                </div>
                <div className="form-group">
                  {idx === 0 && <label className="form-label">Dosage</label>}
                  <input type="text" value={med.dosage}
                    onChange={(e) => updateMedicine(idx, "dosage", e.target.value)}
                    className="form-input" placeholder="e.g. 500mg twice daily" />
                </div>
                <div className="form-group">
                  {idx === 0 && <label className="form-label">Duration</label>}
                  <input type="text" value={med.duration}
                    onChange={(e) => updateMedicine(idx, "duration", e.target.value)}
                    className="form-input" placeholder="e.g. 7 days" />
                </div>
                <div>
                  {medicines.length > 1 && (
                    <button type="button" className="btn btn--danger btn--sm"
                      onClick={() => removeMedicine(idx)}>Remove</button>
                  )}
                </div>
              </div>
            ))}
            <button type="button" className="btn btn--secondary btn--sm" onClick={addMedicine}>
              + Add Medicine
            </button>
          </div>

          {/* Instructions */}
          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label className="form-label">Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="form-input"
              rows={4}
              placeholder="Special instructions for the patient..."
              maxLength={1000}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? "Creating..." : "Create Prescription"}
            </button>
            <button type="button" className="btn btn--secondary"
              onClick={() => navigate("/doctor/appointments")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePrescription;
