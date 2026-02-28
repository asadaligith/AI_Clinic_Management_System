import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <h1 style={{ fontSize: "4rem", color: "#e94560" }}>404</h1>
      <p style={{ fontSize: "1.2rem", margin: "1rem 0" }}>Page not found</p>
      <Link to="/" style={{ color: "#16213e", fontWeight: "bold" }}>
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
