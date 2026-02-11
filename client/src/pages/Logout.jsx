import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function Logout() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setError(null);

    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        // Successfully logged out, redirect to login
        navigate("/login");
      } else {
        setError("Logout failed. Please try again.");
        setIsLoggingOut(false);
      }
    } catch (err) {
      console.error("Logout error:", err);
      setError("Failed to logout. Please try again.");
      setIsLoggingOut(false);
    }
  };

  if (isLoggingOut) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Logging out...</p>
      </div>
    );
  }

  return (
    <button className="logout-button" onClick={handleLogout}>
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
        <path
          d="M6 14H3C2.73478 14 2.48043 13.8946 2.29289 13.7071C2.10536 13.5196 2 13.2652 2 13V3C2 2.73478 2.10536 2.48043 2.29289 2.29289C2.48043 2.10536 2.73478 2 3 2H6M11 11L14 8M14 8L11 5M14 8H6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Logout</span>
      {error && <div className="logout-error">{error}</div>}
    </button>
  );
}

export default Logout;
