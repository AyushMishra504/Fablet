import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import Logout from "./Logout";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isLibraryExpanded, setIsLibraryExpanded] = useState(true);
  const [isExploreExpanded, setIsExploreExpanded] = useState(true);

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {/* New Story Button */}
        <button className="btn-new-story">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          New Story
        </button>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {/* My Library Section */}
          <div className="nav-section">
            <button
              className="nav-section-header"
              onClick={() => setIsLibraryExpanded(!isLibraryExpanded)}
            >
              <span className="nav-section-title">My Library</span>
              <svg
                className={`chevron ${isLibraryExpanded ? "expanded" : ""}`}
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
            {isLibraryExpanded && (
              <div className="nav-section-items">
                <button
                  className="nav-item"
                  onClick={() => navigate("/drafts")}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Drafts
                </button>
              </div>
            )}
          </div>

          {/* Explore Section */}
          <div className="nav-section">
            <button
              className="nav-section-header"
              onClick={() => setIsExploreExpanded(!isExploreExpanded)}
            >
              <span className="nav-section-title">Explore</span>
              <svg
                className={`chevron ${isExploreExpanded ? "expanded" : ""}`}
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
            {isExploreExpanded && (
              <div className="nav-section-items">
                <button
                  className="nav-item"
                  onClick={() => navigate("/explore/all")}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 6H20M4 12H20M4 18H20"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  All titles
                </button>
                <button
                  className="nav-item"
                  onClick={() => navigate("/explore/trending")}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 17L9 11L13 15L21 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 7V13M21 7H15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Trending
                </button>
                <button
                  className="nav-item"
                  onClick={() => navigate("/explore/saved")}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 7C5 5.89543 5.89543 5 7 5H17C18.1046 5 19 5.89543 19 7V21L12 17.5L5 21V7Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Saved
                </button>
              </div>
            )}
          </div>

          {/* Ink AI Assistant */}
          <div className="nav-section">
            <button
              className="nav-item nav-item-ink"
              onClick={() => navigate("/ink")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9.813 15.904L9 18.75L11.846 17.937C12.7174 17.6464 13.4783 17.0938 14.024 16.357L20.485 8.128C21.1648 7.24577 21.1648 5.96223 20.485 5.08C19.8052 4.19777 18.6035 4.19777 17.9237 5.08L11.4627 13.309C10.9169 14.0464 10.4643 14.9074 10.1737 15.779L9.813 15.904Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 7L19 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Ink
              <span className="ink-badge">AI</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Logout at Bottom */}
      <div className="sidebar-footer">
        <Logout />
      </div>
    </aside>
  );
};

export default Sidebar;
