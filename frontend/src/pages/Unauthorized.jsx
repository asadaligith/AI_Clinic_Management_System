import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <h1 style={{ fontSize: "3rem", color: "#e94560" }}>403</h1>
      <p style={{ fontSize: "1.2rem", margin: "1rem 0" }}>
        You don't have permission to access this page.
      </p>
      <Link to="/dashboard" style={{ color: "#16213e", fontWeight: "bold" }}>
        Back to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;
