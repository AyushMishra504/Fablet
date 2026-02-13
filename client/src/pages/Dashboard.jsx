import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import Sidebar from "./Sidebar";
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
          navigate("/login");
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
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="dashboard-container">
        {/* Top Navbar */}
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
                  className={`chevron ${showProfileMenu ? "expanded" : ""}`}
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

              <div
                className={`profile-dropdown ${showProfileMenu ? "open" : ""}`}
              >
                <button className="dropdown-item">Profile</button>
                <button className="dropdown-item">Settings</button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="dashboard-main">
          <h1>Welcome, {data.name || "User"}!</h1>
          <p>Your dashboard content goes here</p>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
