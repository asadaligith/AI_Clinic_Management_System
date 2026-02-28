import { useAuth } from "../context/AuthContext";
import SidebarIcon from "./icons/SidebarIcon";

const DashboardHeader = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user } = useAuth();

  return (
    <header className="dash-header">
      <button
        className="dash-header__toggle"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <SidebarIcon name={isSidebarOpen ? "x" : "menu"} size={22} />
      </button>

      <div className="dash-header__right">
        <span className="dash-header__plan">
          {user?.subscriptionPlan?.toUpperCase()}
        </span>
        <span className="dash-header__greeting">
          {user?.name}
        </span>
      </div>
    </header>
  );
};

export default DashboardHeader;
