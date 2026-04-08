import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

export default function StoryCard({ story, idx, isExplore, onDelete }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = () => {
    navigate(story.status === "published" || isExplore ? `/view/${story._id}` : `/editor/${story._id}`);
  };

  return (
    <article className="db-card" onClick={handleClick}>
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
        
        {isExplore ? (
           <>
              <p className="db-card-updated">{story.wordCount || 0} words</p>
              <p className="db-card-words">{story.name || "Anonymous"}</p>
              <p className="db-card-updated">
              Published {timeAgo(story.updatedAt)}
           </p>
           </>
        ) : (
           <p className="db-card-updated">
              Updated {timeAgo(story.updatedAt)}
           </p>
        )}

        {!isExplore && (
            <div className="db-card-footer">
              <span className="db-card-words">
                {(story.wordCount || 0).toLocaleString()} words
              </span>
              <div style={{ position: 'relative' }}>
                <button
                  className="db-card-menu-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(!menuOpen);
                  }}
                >
                  <svg className="db-card-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="db-card-dropdown" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="db-dropdown-item db-dropdown-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        onDelete(story);
                      }}
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 16, height: 16 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
        )}
      </div>
    </article>
  );
}
