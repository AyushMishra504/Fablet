import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import Sidebar from "./Sidebar";

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
    <div className="dashboard-wrapper">
      {/* Top Navbar */}
      <nav className="dashboard-navbar">
        <div>Fablet</div>
        <Sidebar />

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
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                {/* same dropdown content */}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Below Navbar Layout */}
      <div className="dashboard-body">
        <main className="dashboard-main">{/* Your page content here */}</main>
      </div>
    </div>
  );
};

export default Dashboard;
