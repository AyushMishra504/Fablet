import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { apiFetch } from "../api";
import "../styles/publish.css";

function ConfirmPublishStory({ storyId, className, title, content }) {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const confirmPublish = async () => {
    setIsPublishing(true);
    setError(null);

    try {
      const res = await apiFetch(`/api/stories/${storyId}/publish`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        navigate("/dashboard"); 
      } else {
        setError("Publish failed. Try again.");
        setIsPublishing(false);
        setShowModal(false);
      }
    } catch (err) {
      console.error("Publish error:", err);
      setError("Failed to publish.");
      setIsPublishing(false);
      setShowModal(false);
    }
  };

  const handleOpen = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setError(null);
  };

  if (isPublishing) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Publishing story...</p>
      </div>
    );
  }

  const Modal = () => (
    <div className="publish-modal-overlay" onClick={handleClose}>
      <div className="publish-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="publish-modal-title">Publish Story</h2>
        <p className="publish-modal-message">
          Are you sure you want to publish this story?
        </p>

        <div className="publish-modal-buttons">
          <button className="publish-btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button className="publish-btn-confirm" onClick={confirmPublish}>
            {isPublishing ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button className={className || "publish-button"} onClick={handleOpen}>
        Publish
      </button>

      {error && <div className="logout-error">{error}</div>}

      {showModal && createPortal(<Modal />, document.body)}
    </>
  );
}

export default ConfirmPublishStory;