import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { apiFetch } from "../api";
import "../styles/editor.css";

const INITIAL_CONTENT = ["Start writing your story here..."];

const AI_MESSAGES = [
  {
    id: 1,
    role: "ai",
    text: "How can I help you with your story today? I've analyzed the mood of your last two paragraphs.",
    time: "10:42 AM",
  },
  {
    id: 2,
    role: "user",
    text: "Could you suggest a plot twist for Elias's discovery in the conservatory?",
    time: "10:43 AM",
  },
  {
    id: 3,
    role: "suggestion",
    text: '"What if Elias finds a loose floorboard beneath a fern, containing letters that indicate his father was actually the thief he was investigating?"',
    time: "10:43 AM",
  },
];

export default function ViewStory() {
  const { id } = useParams();
  const { dark } = useTheme();
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const [saveStatus, setSaveStatus] = useState("saved");
  const [wordCount, setWordCount] = useState(0);
  
  const [aiInput, setAiInput] = useState("");
  const [messages, setMessages] = useState(AI_MESSAGES);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
 
  const editorRef = useRef(null);



  const handleBack = () => {
    window.history.back();
  };

useEffect(() => {
  const fetchStory = async () => {
    const res = await apiFetch(`/api/stories/${id}`, {
      credentials: "include",
    });

    const data = await res.json();

    setTitle(data.title || "");

    if (editorRef.current) {
      editorRef.current.innerText = data.content || "";
      const words = (data.content || "").trim().split(/\s+/).filter(Boolean).length;
      setWordCount(words);
    }
    
    setSaveStatus("saved");
  };

  if (id) fetchStory();
}, [id]);

  const handleSendAI = () => {
    if (!aiInput.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: aiInput, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setAiInput("");
    // Simulate AI reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", text: "That's a compelling direction! Let me think about how to weave that into your narrative...", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);
    }, 1200);
  };

  return (
    <div className={`ed-root ${dark ? "ed-dark" : ""}`}>

      {/* ── Unsaved Changes Dialog ── */}
      {showConfirmDialog && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'var(--header-bg)', padding: '24px', borderRadius: '12px', maxWidth: '400px', width: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', color: 'var(--text)', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600', fontFamily: 'Inter, sans-serif' }}>Unsaved Changes</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5', fontFamily: 'Inter, sans-serif' }}>You have unsaved changes. Are you sure you want to go back? Your unsaved writing will be lost.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setShowConfirmDialog(false)}
                style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '500', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.target.style.background = 'var(--toolbar-hover)'}
                onMouseOut={(e) => e.target.style.background = 'transparent'}
              >
                Cancel
              </button>
              <button 
                onClick={() => navigate("/Dashboard")}
                style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#dc2626', color: '#fff', cursor: 'pointer', fontWeight: '600', fontFamily: 'Inter, sans-serif', fontSize: '14px', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.target.style.background = '#b91c1c'}
                onMouseOut={(e) => e.target.style.background = '#dc2626'}
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}

    
      {/* ── Header ── */}
      <header className="ed-header">
        <div className="ed-header-left">          
          <button className="ed-logo-btn" onClick={handleBack}>
            <div className="ed-logo-icon">F</div>
            <span className="ed-logo-text">Fablet</span>
          </button>
          <button 
            className="ed-toolbar-btn" 
            onClick={handleBack} 
            title="Back to Dashboard"
            style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '4px 4px', width: 'auto', borderRadius: '2px' }}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          
        </div>

        <div className="ed-header-right">
          <div className="ed-status">
            <span className={`ed-status-dot ${
              saveStatus === "saved" ? "ed-dot-saved" :
              saveStatus === "error"  ? "ed-dot-error"  :
              "ed-dot-saving"
            }`} />
            <span>{
              saveStatus === "saved"   ? "Saved" :
              saveStatus === "saving"  ? "Saving..." :
              saveStatus === "error"   ? "Save failed" :
              "Unsaved changes"
            }</span>
          </div>
          <span className="ed-wordcount">{wordCount.toLocaleString()} {wordCount === 1 ? "word" : "words"}</span>
          <div className="ed-divider" />
      

        </div>
      </header>

      {/* ── Body ── */}
      <main className="ed-body">

        {/* Writing Canvas */}
        <section className="ed-canvas">
          <div className="ed-paper">
            
            <input
              className="ed-title-input"
              placeholder="Title of your masterpiece..."
              value={title}
              readOnly
            />
            <div
              ref={editorRef}
              className="ed-editor"
              contentEditable={false}
            >     
              {INITIAL_CONTENT.map((p, i) => (
                <p key={i} className="ed-para">{p}</p>
              ))}
            </div>
          </div>
        </section>



      </main>
    </div>
  );
}