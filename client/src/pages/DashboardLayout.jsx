import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import "../styles/dashboard.css";

const NavIcon = ({ path, path2 }) => (
  <svg className="db-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    {path2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path2} />}
  </svg>
);

export default function DashboardLayout() {
  const { dark, setDark } = useTheme();
  const [data, setData] = useState(null);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        navigate("/");
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/dashboard", { credentials: "include" });
        if (res.status === 401) {
          setData({ name: "Bones", email: "bones@boneyard.local" });
          return;
        }
        const dashData = await res.json();
        setData(dashData.user);
      } catch (err) {
        console.error("Failed to load user", err);
      }
    };
    fetchUser();
  }, [navigate]);

  return (
    <div className={`db-root ${dark ? "db-dark" : "db-light"}`}>
      <aside className="db-sidebar">
        <div className="db-sidebar-logo">
          <div className="db-logo-icon">F</div>
          <span className="db-logo-text">Fablet</span>
        </div>
        <nav className="db-nav">
          {[
            {
              label: "Library",
              path: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
              route: "/Dashboard",
            },
            {
              label: "Explore",
              path: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
              route: "/explore",
            },
            {
              label: "Settings",
              path: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94-1.543-.826-3.31-2.37-2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
              path2: "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
              route: "/Dashboard/#",
            },
          ].map(({ label, route, path, path2 }) => (
            <div
              key={label}
              className={`db-nav-link ${
                location.pathname.toLowerCase() === route.toLowerCase() ? "db-nav-active" : ""
              }`}
              onClick={() => navigate(route)}
              style={{ cursor: "pointer" }}
            >
              <NavIcon path={path} path2={path2} />
              {label}
            </div>
          ))}
          <button 
            className="db-nav-link" 
            style={{ marginTop: "auto", border: "none", background: "transparent", cursor: "pointer", width: "100%", textAlign: "left", fontFamily: "inherit", padding: "0.625rem 1rem" }}
            onClick={() => setShowSignOutConfirm(true)}
          >
            <NavIcon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            Sign Out
          </button>
        </nav>
        {data && (
          <div className="db-sidebar-user">
            <button className="db-user-btn">
              <div className="db-avatar-initial">
                {data.name?.[0]?.toUpperCase() || data.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="db-user-info">
                <p className="db-user-name">{data.name || data.email || "User"}</p>
                <p className="db-user-plan">Premium Plan</p>
              </div>
            </button>
          </div>
        )}
      </aside>

      <Outlet context={{ user: data, dark, setDark }} />

      {/* ── Sign Out Confirmation Dialog ── */}
      {showSignOutConfirm && (
        <div className="db-modal-overlay" onClick={() => setShowSignOutConfirm(false)}>
          <div className="db-modal" onClick={(e) => e.stopPropagation()}>
            <div className="db-modal-icon" style={{ color: '#4f46e5', background: 'rgba(79, 70, 229, 0.1)' }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 28, height: 28 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h3 className="db-modal-title">Sign Out</h3>
            <p className="db-modal-text">
              Are you sure you want to sign out of Fablet? You'll need to log back in to access your stories.
            </p>
            <div className="db-modal-actions">
              <button className="db-modal-cancel" onClick={() => setShowSignOutConfirm(false)}>Cancel</button>
              <button 
                className="db-modal-delete" 
                style={{ background: '#4f46e5' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#4338ca'}
                onMouseOut={(e) => e.currentTarget.style.background = '#4f46e5'}
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
