import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import sidebarMenus from "../config/sidebarMenus";
import SidebarIcon from "./icons/SidebarIcon";

const ROLE_LABELS = {
  admin: "Administrator",
  doctor: "Doctor",
  receptionist: "Receptionist",
  patient: "Patient",
};

const ROLE_COLORS = {
  admin: "#e94560",
  doctor: "#2ecc71",
  receptionist: "#f39c12",
  patient: "#9b59b6",
};

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menu = sidebarMenus[user?.role] || [];
  const roleColor = ROLE_COLORS[user?.role] || "#16213e";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        {/* Brand */}
        <div className="sidebar__brand">
          <span className="sidebar__logo">AI</span>
          <div>
            <div className="sidebar__title">AI Clinic</div>
            <div className="sidebar__subtitle">Management System</div>
          </div>
        </div>

        {/* User info */}
        <div className="sidebar__user">
          <div className="sidebar__avatar" style={{ background: roleColor }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="sidebar__user-info">
            <div className="sidebar__user-name">{user?.name}</div>
            <div className="sidebar__user-role" style={{ color: roleColor }}>
              {ROLE_LABELS[user?.role]}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path.endsWith("/dashboard")}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
              }
              onClick={onClose}
            >
              <SidebarIcon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="sidebar__footer">
          <button className="sidebar__logout" onClick={handleLogout}>
            <SidebarIcon name="logout" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
