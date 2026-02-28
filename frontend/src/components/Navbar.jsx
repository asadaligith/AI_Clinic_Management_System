import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="public-nav">
      <Link to="/" className="public-nav__brand">
        AI Clinic
      </Link>
      <div className="public-nav__links">
        {user ? (
          <Link to="/dashboard" className="public-nav__btn public-nav__btn--primary">
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link to="/login" className="public-nav__link">
              Login
            </Link>
            <Link to="/register" className="public-nav__btn public-nav__btn--primary">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
