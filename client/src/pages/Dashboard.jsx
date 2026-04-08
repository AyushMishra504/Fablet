import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import StoryCard from "./StoryCard";

const DarkToggle = ({ dark, setDark }) => (
  <button
    onClick={() => setDark(prev => !prev)}
    className={`db-toggle ${dark ? "db-toggle-on" : "db-toggle-off"}`}
    aria-label="Toggle dark mode"
  >
    <span className={`db-toggle-thumb ${dark ? "db-thumb-on" : ""}`}>
      {dark ? "🌙" : "☀️"}
    </span>
  </button>
);

export default function Dashboard() {
  const { user, dark, setDark } = useOutletContext();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreateStory = async () => {
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      navigate(`/editor/${data._id}`);
    } catch(e) {
      console.error(e);
    }
  };

  const handleDeleteStory = async (story) => {
    try {
      const res = await fetch(`/api/stories/${story._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setStories((prev) => prev.filter((s) => s._id !== story._id));
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch("/api/stories", { credentials: "include" });
        const json = await res.json();
        setStories(Array.isArray(json) ? json : []);
      } catch (err) {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  if (loading) {
    return (
      <main className="db-main">
        <div className="db-loading" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="db-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </main>
    );
  }

  const filtered = stories.filter((s) =>
    (s.title || "").toLowerCase().includes(search.toLowerCase())
  );

  // We map over a mock array when loading so Skeleton screens generate repeatedly
  const displayItems = loading ? Array(6).fill(null) : filtered;

  return (
    <main className="db-main">
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

      {error ? (
        <div className="db-error"><p>{error}</p></div>
      ) : (
        <section className="db-section">
          <div className="db-grid">
            {filtered.map((story, idx) => (
                <StoryCard 
                  key={story._id}
                  story={story} 
                  idx={idx} 
                  isExplore={false} 
                  onDelete={handleDeleteStory} 
                />
            ))}

            {filtered.length === 0 && stories.length === 0 && (
              <div className="db-empty">
                <p className="db-empty-title">No stories yet</p>
                <p className="db-empty-sub">Click "Start New Story" to begin writing</p>
              </div>
            )}

            <button className="db-new-card" onClick={handleCreateStory}>
                <div className="db-new-card-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 24, height: 24 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="db-new-card-label">Create New Story</span>
                <span className="db-new-card-sub">Start your next literary masterpiece</span>
            </button>
          </div>
        </section>
      )}

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
  );
}