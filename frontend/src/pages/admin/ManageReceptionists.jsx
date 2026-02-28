import { useState, useEffect, useCallback } from "react";
import { getUsersApi, updateUserApi, createReceptionistApi } from "../../api/adminApi";
import toast from "react-hot-toast";

const ManageReceptionists = () => {
  const [receptionists, setReceptionists] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [creating, setCreating] = useState(false);

  const fetchReceptionists = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = { role: "receptionist", page, limit: 10 };
        if (search) params.search = search;
        const { data } = await getUsersApi(params);
        setReceptionists(data.data.users);
        setPagination(data.data.pagination);
      } catch {
        toast.error("Failed to load receptionists");
      } finally {
        setLoading(false);
      }
    },
    [search]
  );

  useEffect(() => {
    fetchReceptionists(1);
  }, [fetchReceptionists]);

  const toggleActive = async (id, currentStatus) => {
    try {
      await updateUserApi(id, { isActive: !currentStatus });
      toast.success(`Receptionist ${currentStatus ? "deactivated" : "activated"}`);
      fetchReceptionists(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.password || form.password.length < 6) errs.password = "Min 6 characters";
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setCreating(true);
    try {
      await createReceptionistApi(form);
      toast.success("Receptionist created successfully");
      setForm({ name: "", email: "", password: "" });
      setShowForm(false);
      fetchReceptionists(1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create receptionist");
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });

  return (
    <div>
      <div className="dash-page__header">
        <h1 className="dash-page__title">Manage Receptionists</h1>
        <p className="dash-page__subtitle">
          {pagination.total} receptionist{pagination.total !== 1 ? "s" : ""} registered
        </p>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <button className="btn btn--primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Receptionist"}
        </button>
      </div>

      {showForm && (
        <div className="form-card" style={{ marginBottom: "1.5rem" }}>
          <form onSubmit={handleCreate} noValidate>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" value={form.name}
                  onChange={handleFormChange}
                  className={`form-input ${formErrors.name ? "form-input--error" : ""}`}
                  placeholder="Full Name" />
                {formErrors.name && <span className="form-error">{formErrors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" name="email" value={form.email}
                  onChange={handleFormChange}
                  className={`form-input ${formErrors.email ? "form-input--error" : ""}`}
                  placeholder="receptionist@clinic.com" />
                {formErrors.email && <span className="form-error">{formErrors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" name="password" value={form.password}
                  onChange={handleFormChange}
                  className={`form-input ${formErrors.password ? "form-input--error" : ""}`}
                  placeholder="Min 6 characters" />
                {formErrors.password && <span className="form-error">{formErrors.password}</span>}
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn--primary" disabled={creating}>
                {creating ? "Creating..." : "Create Receptionist"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-toolbar">
        <div className="table-search">
          <input type="text" placeholder="Search by name..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input" style={{ maxWidth: 300 }} />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="table-empty">Loading receptionists...</td></tr>
            ) : receptionists.length === 0 ? (
              <tr><td colSpan="5" className="table-empty">No receptionists found.</td></tr>
            ) : (
              receptionists.map((r) => (
                <tr key={r._id}>
                  <td className="table-name">{r.name}</td>
                  <td>{r.email}</td>
                  <td>
                    <span className="table-badge" style={{ background: r.isActive ? "#2ecc71" : "#e74c3c" }}>
                      {r.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{formatDate(r.createdAt)}</td>
                  <td>
                    <button
                      className={`btn btn--sm ${r.isActive ? "btn--danger" : "btn--primary"}`}
                      onClick={() => toggleActive(r._id, r.isActive)}
                    >
                      {r.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div className="table-pagination">
          <button className="btn btn--secondary btn--sm" disabled={pagination.page <= 1}
            onClick={() => fetchReceptionists(pagination.page - 1)}>Previous</button>
          <span className="table-pagination__info">Page {pagination.page} of {pagination.pages}</span>
          <button className="btn btn--secondary btn--sm" disabled={pagination.page >= pagination.pages}
            onClick={() => fetchReceptionists(pagination.page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default ManageReceptionists;
