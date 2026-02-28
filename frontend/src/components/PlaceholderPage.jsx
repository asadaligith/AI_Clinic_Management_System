import SidebarIcon from "./icons/SidebarIcon";

const PlaceholderPage = ({ title, description, icon = "grid" }) => {
  return (
    <div>
      <div className="dash-page__header">
        <h1 className="dash-page__title">{title}</h1>
      </div>
      <div className="placeholder-section">
        <div className="placeholder-section__icon">
          <SidebarIcon name={icon} size={48} />
        </div>
        <div className="placeholder-section__title">{title}</div>
        <p className="placeholder-section__text">
          {description || "This feature is coming soon."}
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
