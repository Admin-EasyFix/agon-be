import { useState, useEffect, useRef } from "react";
import useLogout from "../hooks/useLogout";
import doveIcon from '../assets/golden_dove.svg';
import userIcon from '../assets/user.png';
import { useAthlete } from "../hooks/useStravaAthlete";
import "../styles/navbar.css";

function Navbar() {
  const { logout, loading: logoutLoading, error: logoutError } = useLogout();
  const [open, setOpen] = useState(false);
  const { athlete, loading, error: apiError, refetch } = useAthlete();
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
            src={athlete?.profilePicture || userIcon}
            alt="Profile"
            className="profile-pic"
            onClick={apiError ? refetch : toggleMenu}
          />
        )}
        {open && (
          <div className="dropdown" ref={dropdownRef}>
            <button onClick={() => logout()} disabled={logoutLoading}>
              {logoutLoading ? "Logging out..." : "Logout"}
            </button>
            {logoutError && <div className="text-red-500 text-sm mt-2">{logoutError}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
