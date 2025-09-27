import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import doveIcon from '../assets/golden_dove.svg';
import userIcon from '../assets/user.png';
import { useStravaAthlete } from "../hooks/useStravaAthlete";
import "../styles/navbar.css";

function Navbar() {
  const { token, logOut } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const { athlete, loading, error: apiError, refetch } = useStravaAthlete(token);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleMenu = () => setOpen((prev) => !prev);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={doveIcon} className="logo" />
      </div>

      <div className="navbar-right">
        {loading ? (
          <div className="profile-loading-indicator">
            <div className="spinner"></div>
          </div>
        ) : (
          <img
            src={athlete?.profile || userIcon}
            alt="Profile"
            className="profile-pic"
            onClick={apiError ? refetch : toggleMenu}
          />
        )}
        {open && (
          <div className="dropdown" ref={dropdownRef}>
            <button onClick={logOut}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
