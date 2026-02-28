import { useState, useEffect } from "react";
import { getAppointmentsApi } from "../../api/appointmentApi";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  pending: "#f39c12",
  confirmed: "#3498db",
  completed: "#2ecc71",
};

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getAppointmentsApi({ limit: 50 });
        setAppointments(data.data.appointments);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) return <div className="loading">Loading appointments...</div>;

  return (
    <div>
      <div className="dash-page__header">
        <h1 className="dash-page__title">My Appointments</h1>
        <p className="dash-page__subtitle">
          {appointments.length} appointment{appointments.length !== 1 ? "s" : ""}
        </p>
      </div>

      {appointments.length === 0 ? (
        <div className="placeholder-section">
          <div className="placeholder-section__title">No Appointments Yet</div>
          <p className="placeholder-section__text">
            Your scheduled appointments will appear here.
          </p>
        </div>
      ) : (
        <div className="appt-cards">
          {appointments.map((a) => (
            <div className="appt-card" key={a._id}>
              <div className="appt-card__top">
                <span className="appt-card__date">{formatDate(a.date)}</span>
                <span
                  className="table-badge"
                  style={{ background: STATUS_COLORS[a.status] }}
                >
                  {a.status}
                </span>
              </div>
              <div className="appt-card__doctor">
                Dr. {a.doctorId?.name || "—"}
              </div>
              <div className="appt-card__time">{formatTime(a.date)}</div>
              {a.reason && (
                <div className="appt-card__reason">{a.reason}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
