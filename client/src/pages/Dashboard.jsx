import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import Logout from "./Logout";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard", {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 401) {
          navigate("/register");
          return;
        }

        const data = await res.json();
        const user = data.user;
        setData(user);
      } catch (err) {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="navbar-logo">Fablet</div>

        <div className="navbar-right">
          <div className="profile-wrapper">
            <button
              className="profile-button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="profile-avatar">
                {data.name?.[0]?.toUpperCase() ||
                  data.email?.[0]?.toUpperCase() ||
                  "U"}
              </div>
              <span className="profile-name">
                {data.name || data.email || "User"}
              </span>
              <svg
                className={`chevron-icon ${showProfileMenu ? "rotated" : ""}`}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="dropdown-item profile-info">
                  <div className="info-label">Signed in as</div>
                  <div className="info-value">
                    {data.email || data.username}
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z"
                      fill="currentColor"
                    />
                  </svg>
                  Profile
                </button>
                <button className="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M13.5 8C13.5 8.17 13.49 8.34 13.47 8.51L15.1 9.77C15.24 9.88 15.28 10.07 15.19 10.23L13.59 13.27C13.5 13.43 13.31 13.49 13.15 13.43L11.22 12.63C10.88 12.88 10.51 13.09 10.11 13.24L9.83 15.29C9.81 15.47 9.65 15.6 9.47 15.6H6.27C6.09 15.6 5.93 15.47 5.91 15.29L5.63 13.24C5.23 13.09 4.86 12.88 4.52 12.63L2.59 13.43C2.43 13.49 2.24 13.43 2.15 13.27L0.55 10.23C0.46 10.07 0.5 9.88 0.64 9.77L2.27 8.51C2.25 8.34 2.24 8.17 2.24 8C2.24 7.83 2.25 7.66 2.27 7.49L0.64 6.23C0.5 6.12 0.46 5.93 0.55 5.77L2.15 2.73C2.24 2.57 2.43 2.51 2.59 2.57L4.52 3.37C4.86 3.12 5.23 2.91 5.63 2.76L5.91 0.71C5.93 0.53 6.09 0.4 6.27 0.4H9.47C9.65 0.4 9.81 0.53 9.83 0.71L10.11 2.76C10.51 2.91 10.88 3.12 11.22 3.37L13.15 2.57C13.31 2.51 13.5 2.57 13.59 2.73L15.19 5.77C15.28 5.93 15.24 6.12 15.1 6.23L13.47 7.49C13.49 7.66 13.5 7.83 13.5 8ZM8 5.5C6.62 5.5 5.5 6.62 5.5 8C5.5 9.38 6.62 10.5 8 10.5C9.38 10.5 10.5 9.38 10.5 8C10.5 6.62 9.38 5.5 8 5.5Z"
                      fill="currentColor"
                    />
                  </svg>
                  Settings
                </button>
                <div className="dropdown-divider"></div>
                <Logout />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Empty content area - ready for your content */}
      </main>
    </div>
  );
};

export default Dashboard;
