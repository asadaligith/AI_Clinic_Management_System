import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getPatientsApi } from "../../api/patientApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const PatientList = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const basePath = `/${user?.role}`;

  const fetchPatients = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      if (genderFilter) params.gender = genderFilter;

      const { data } = await getPatientsApi(params);
      setPatients(data.data.patients);
      setPagination(data.data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }, [search, genderFilter]);

  useEffect(() => {
    fetchPatients(1);
  }, [fetchPatients]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPatients(1);
  };

  const genderBadge = (g) => {
    const colors = { male: "#3498db", female: "#e91e8c", other: "#8e44ad" };
    return (
      <span className="table-badge" style={{ background: colors[g] || "#94a3b8" }}>
        {g}
      </span>
    );
  };

  return (
    <div>
      <div className="dash-page__header">
        <h1 className="dash-page__title">Patients</h1>
        <p className="dash-page__subtitle">
          {pagination.total} patient{pagination.total !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Filters */}
      <div className="table-toolbar">
        <form onSubmit={handleSearch} className="table-search">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
          />
          <button type="submit" className="btn btn--primary btn--sm">
            Search
          </button>
        </form>
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="form-input"
          style={{ width: "auto" }}
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Contact</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="table-empty">
                  Loading patients...
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan="6" className="table-empty">
                  No patients found.
                </td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr key={p._id}>
                  <td className="table-name">{p.name}</td>
                  <td>{p.age}</td>
                  <td>{genderBadge(p.gender)}</td>
                  <td>{p.contact}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link
                      to={`${basePath}/patients/${p._id}`}
                      className="btn btn--outline btn--sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="table-pagination">
          <button
            className="btn btn--secondary btn--sm"
            disabled={pagination.page <= 1}
            onClick={() => fetchPatients(pagination.page - 1)}
          >
            Previous
          </button>
          <span className="table-pagination__info">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            className="btn btn--secondary btn--sm"
            disabled={pagination.page >= pagination.pages}
            onClick={() => fetchPatients(pagination.page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientList;
