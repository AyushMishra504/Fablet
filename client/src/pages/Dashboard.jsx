import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";


// Gradient covers since DB stories don't have images
const CARD_GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
];

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return "Just now";
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)   return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

const NavIcon = ({ path, path2 }) => (
  <svg className="db-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    {path2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path2} />}
  </svg>
);

const DarkToggle = ({ dark, setDark }) => (
  <button
    onClick={() => setDark(!dark)}
    className={`db-toggle ${dark ? "db-toggle-on" : "db-toggle-off"}`}
    aria-label="Toggle dark mode"
  >
    <span className={`db-toggle-thumb ${dark ? "db-thumb-on" : "db-thumb-off"}`}>
      {dark ? "🌙" : "☀️"}
    </span>
  </button>
);


export default function Dashboard() {
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [stories, setStories] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreateStory = async () => {
    const res = await fetch("/api/stories", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    navigate(`/editor/${data._id}`);
  }
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dashRes, storiesRes] = await Promise.all([
          fetch("/api/dashboard", { credentials: "include" }),
          fetch("/api/stories",   { credentials: "include" }),
        ]);

        if (dashRes.status === 401) {
          navigate("/login");
          return;
        }

        const dashJson    = await dashRes.json();
        const storiesJson = await storiesRes.json();

        setData(dashJson.user);
        setStories(Array.isArray(storiesJson) ? storiesJson : []);
      } catch (err) {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [navigate]);

  if (loading) return (
    <div className="db-loading">
      <div className="db-spinner"></div>
      <p>Loading dashboard...</p>
    </div>
  );

  if (error) return <div className="db-error"><p>{error}</p></div>;
  if (!data) return null;


  const filtered = stories.filter((s) =>
    (s.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`db-root ${dark ? "db-dark" : "db-light"}`}>

      {/* ── Sidebar ── */}
      <aside className="db-sidebar">
        <div className="db-sidebar-logo">
          <div className="db-logo-icon">F</div>
          <span className="db-logo-text">Fablet</span>
        </div>

        <nav className="db-nav">
          {[
            {
              label: "Library",
              active: true,
              path: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
            },
            {
              label: "Explore",
              active: false,
              path: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
            },
            {
              label: "Settings",
              active: false,
              path: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
              path2: "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
            },
          ].map(({ label, active, path, path2 }) => (
            <a key={label} href="#" className={`db-nav-link ${active ? "db-nav-active" : ""}`}>
              <NavIcon path={path} path2={path2} />
              {label}
            </a>
          ))}
        </nav>

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
      </aside>

      {/* ── Main ── */}
      <main className="db-main">

        {/* Header */}
        <header className="db-header">
          <h1 className="db-header-title">Your Stories</h1>
          <div className="db-header-actions">
            <div className="db-search-wrap">
              <svg className="db-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search stories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="db-search-input"
              />
            </div>
            <DarkToggle dark={dark} setDark={setDark} />
            <button className="db-new-btn" onClick={handleCreateStory}>
              <svg className="db-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Start New Story
            </button>
          </div>
        </header>

        {/* Grid */}
        <section className="db-section">
          <div className="db-grid">
            {filtered.map((story, idx) => (
              <article
                key={story._id}
                className="db-card"
                onClick={() => navigate(`/editor/${story._id}`)}
              >
                <div
                  className="db-card-image-wrap"
                  style={{ background: CARD_GRADIENTS[idx % CARD_GRADIENTS.length] }}
                >
                  <span
                    className={`db-badge ${
                      story.status === "published" ? "badge-published" : "badge-draft"
                    }`}
                  >
                    {story.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="db-card-body">
                  <h3 className="db-card-title">
                    {story.title || "Untitled Story"}
                  </h3>
                  <p className="db-card-updated">
                    Updated {timeAgo(story.updatedAt)}
                  </p>
                  <div className="db-card-footer">
                    <span className="db-card-words">
                      {(story.wordCount || 0).toLocaleString()} words
                    </span>
                    <button
                      className="db-card-menu-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="db-card-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {/* Empty state */}
            {filtered.length === 0 && stories.length === 0 && (
              <div className="db-empty">
                <p className="db-empty-title">No stories yet</p>
                <p className="db-empty-sub">Click "Start New Story" to begin writing</p>
              </div>
            )}

            {/* New story placeholder */}
            <button className="db-new-card" onClick={handleCreateStory}>
              <div className="db-new-card-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 24, height: 24 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="db-new-card-label">Create New Work</span>
              <span className="db-new-card-sub">Start your next literary masterpiece</span>
            </button>
          </div>
        </section>

        {/* AI Footer */}
        <footer className="db-footer">
          <div className="db-footer-inner">
            <div className="db-insight">
              <div className="db-insight-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 20, height: 20 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="db-insight-title">AI Writing Insight</p>
                <p className="db-insight-text">
                  Based on your recent drafts, your prose is leaning towards Gothic Romanticism. Would you like suggestions for atmospheric world-building?
                </p>
              </div>
            </div>
            <button className="db-analytics-btn">View Analytics</button>
          </div>
        </footer>

      </main>
    </div>
  );
}