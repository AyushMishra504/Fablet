import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { apiFetch } from "../api";
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

export default function Explore() {
  const { dark, setDark } = useOutletContext();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExplore = async () => {
      try {
        const res = await apiFetch("/api/explore", { credentials: "include" });
        const exploreData = await res.json();
        setStories(Array.isArray(exploreData) ? exploreData : []);
      } catch (err) {
        setError("Failed to load explore page");
      } finally {
        setLoading(false);
      }
    };
    fetchExplore();
  }, []);

  if (loading) {
    return (
      <main className="db-main">
        <div className="db-loading" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading explore...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="db-main">
      <header className="db-header">
        <h1 className="db-header-title">Explore Stories</h1>
        <div className="db-header-actions">
          <DarkToggle dark={dark} setDark={setDark} />
        </div>
      </header>

      {error ? (
        <div className="db-error"><p>{error}</p></div>
      ) : (
        <section className="db-section">
          <div className="db-grid">
            {stories.map((story, idx) => (
                <StoryCard 
                  key={story._id}
                  story={story} 
                  idx={idx} 
                  isExplore={true} 
                />
            ))}

            {stories.length === 0 && (
              <div className="db-empty">
                <p>No stories found</p>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}