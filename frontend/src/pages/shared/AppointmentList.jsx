import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAppointmentsApi,
  updateAppointmentStatusApi,
  deleteAppointmentApi,
} from "../../api/appointmentApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const STATUS_OPTIONS = ["pending", "confirmed", "completed"];

const STATUS_COLORS = {
  pending: "#f39c12",
  confirmed: "#3498db",
  completed: "#2ecc71",
};

const AppointmentList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const canUpdateStatus = ["doctor", "admin"].includes(user?.role);
  const canDelete = ["receptionist", "admin"].includes(user?.role);
  const isDoctor = user?.role === "doctor";

  const fetchAppointments = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = { page, limit: 10 };
        if (statusFilter) params.status = statusFilter;
        if (dateFilter) params.date = dateFilter;

        const { data } = await getAppointmentsApi(params);
        setAppointments(data.data.appointments);
        setPagination(data.data.pagination);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, dateFilter]
  );

  useEffect(() => {
    fetchAppointments(1);
  }, [fetchAppointments]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateAppointmentStatusApi(id, newStatus);
      toast.success("Status updated");
      fetchAppointments(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await deleteAppointmentApi(id);
      toast.success("Appointment deleted");
      fetchAppointments(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric", year: "numeric",
    });

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  // For doctor: determine valid next status
  const getNextStatus = (current) => {
    if (current === "pending") return "confirmed";
    if (current === "confirmed") return "completed";
    return null;
  };

  return (
    <div>
      <div className="dash-page__header">
        <h1 className="dash-page__title">Appointments</h1>
        <p className="dash-page__subtitle">
          {pagination.total} appointment{pagination.total !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Filters */}
      <div className="table-toolbar">
        <div className="table-search" style={{ gap: "0.75rem" }}>
          <div className="form-group" style={{ minWidth: 160 }}>
            <label className="form-label">Date</label>
            <input type="date" value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)} className="form-input" />
          </div>
          <div className="form-group" style={{ minWidth: 150 }}>
            <label className="form-label">Status</label>
            <select value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)} className="form-input">
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          {(dateFilter || statusFilter) && (
            <button className="btn btn--secondary btn--sm"
              style={{ alignSelf: "flex-end", marginBottom: 2 }}
              onClick={() => { setDateFilter(""); setStatusFilter(""); }}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              {user?.role !== "doctor" && <th>Doctor</th>}
              <th>Date</th>
              <th>Time</th>
              <th>Reason</th>
              <th>Status</th>
              {(canUpdateStatus || canDelete || isDoctor) && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="table-empty">Loading appointments...</td></tr>
            ) : appointments.length === 0 ? (
              <tr><td colSpan="7" className="table-empty">No appointments found.</td></tr>
            ) : (
              appointments.map((a) => {
                const nextStatus = getNextStatus(a.status);
                return (
                  <tr key={a._id}>
                    <td className="table-name">{a.patientId?.name || "\u2014"}</td>
                    {user?.role !== "doctor" && (
                      <td>Dr. {a.doctorId?.name || "\u2014"}</td>
                    )}
                    <td>{formatDate(a.date)}</td>
                    <td>{formatTime(a.date)}</td>
                    <td style={{ maxWidth: 180 }}>
                      <span className="text-truncate">{a.reason || "\u2014"}</span>
                    </td>
                    <td>
                      <span className="table-badge" style={{ background: STATUS_COLORS[a.status] }}>
                        {a.status}
                      </span>
                    </td>
                    {(canUpdateStatus || canDelete || isDoctor) && (
                      <td>
                        <div className="table-actions">
                          {canUpdateStatus && nextStatus && (
                            <button
                              className="btn btn--primary btn--sm"
                              disabled={updatingId === a._id}
                              onClick={() => handleStatusChange(a._id, nextStatus)}
                            >
                              {nextStatus === "confirmed" ? "Confirm" : "Complete"}
                            </button>
                          )}
                          {isDoctor && a.status === "completed" && (
                            <button
                              className="btn btn--secondary btn--sm"
                              onClick={() => navigate(`/doctor/create-prescription/${a._id}`)}
                            >
                              Prescribe
                            </button>
                          )}
                          {canDelete && (
                            <button className="btn btn--danger btn--sm"
                              onClick={() => handleDelete(a._id)}>Delete</button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="table-pagination">
          <button className="btn btn--secondary btn--sm" disabled={pagination.page <= 1}
            onClick={() => fetchAppointments(pagination.page - 1)}>Previous</button>
          <span className="table-pagination__info">Page {pagination.page} of {pagination.pages}</span>
          <button className="btn btn--secondary btn--sm" disabled={pagination.page >= pagination.pages}
            onClick={() => fetchAppointments(pagination.page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
