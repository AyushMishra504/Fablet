import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../ThemeContext";
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

export default function Editor() {
  const { id } = useParams();
  const { dark } = useTheme();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const [panelOpen, setPanelOpen] = useState(true);
  const [autoSuggest, setAutoSuggest] = useState(true);
  const [saveStatus, setSaveStatus] = useState("saved"); // "unsaved" | "saving" | "saved" | "error"
  const [wordCount, setWordCount] = useState(0);
  const [aiInput, setAiInput] = useState("");
  const [messages, setMessages] = useState(AI_MESSAGES);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const editorRef = useRef(null);
  const chatEndRef = useRef(null);

  // Real save handler
  const handleSave = async () => {
    if (saveStatus === "saving") return;
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/stories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          content: editorRef.current?.innerText || content,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  };

  // Mark unsaved on title or content change
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setSaveStatus("unsaved");
  };

  const handleBack = () => {
    if (saveStatus === "unsaved") {
      setShowConfirmDialog(true);
    } else {
      navigate("/Dashboard");
    }
  };

  const handleDeleteEditorStory = async () => {
    try {
      const res = await fetch(`/api/stories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        navigate("/Dashboard");
      }
    } catch (err) {
      console.error("Failed to delete story", err);
    }
  };

  // Scroll chat to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Word count from editor
  const handleEditorInput = () => {
    const text = editorRef.current?.innerText || "";
    setContent(text);
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setSaveStatus("unsaved");
  };
useEffect(() => {
  const fetchStory = async () => {
    const res = await fetch(`/api/stories/${id}`, {
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

      {/* ── Delete Story Dialog ── */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'var(--header-bg)', padding: '24px', borderRadius: '12px', maxWidth: '400px', width: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', color: 'var(--text)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '9999px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 28, height: 28 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600', fontFamily: 'Inter, sans-serif' }}>Delete Story</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5', fontFamily: 'Inter, sans-serif' }}>
              Are you sure you want to delete this story? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '500', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.target.style.background = 'var(--toolbar-hover)'}
                onMouseOut={(e) => e.target.style.background = 'transparent'}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteEditorStory}
                style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: '500', fontFamily: 'Inter, sans-serif', fontSize: '14px', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.target.style.background = '#dc2626'}
                onMouseOut={(e) => e.target.style.background = '#ef4444'}
              >
                Delete
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
          

          <div className="ed-toolbar">
            
            {[
              { title: "Bold", path: "M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" },
              { title: "Italic", path: "M10 20l4-16m-4 0h4m-6 16h4" },
              { title: "Quote", path: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
            ].map(({ title, path }) => (
              <button
                key={title}
                className="ed-toolbar-btn"
                title={title}
                onClick={() => document.execCommand(title.toLowerCase())}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 20, height: 20 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
                </svg>
              </button>
            ))}
          </div>
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
          <button
            className="ed-save-btn"
            onClick={handleSave}
            disabled={saveStatus === "saving" || saveStatus === "saved"}
            title="Save draft (Ctrl+S)"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 16, height: 16 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            {saveStatus === "saving" ? "Saving..." : "Save Draft"}
          </button>
          
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '36px', 
              height: '36px', 
              borderRadius: '9999px', 
              background: '#ef4444',
              border: '1px solid transparent',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Delete Story"
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#dc2626';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#ef4444';
            }}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          <button className="ed-publish-btn">Publish</button>
          {!panelOpen && (
            <button className="ed-open-panel-btn" onClick={() => setPanelOpen(true)} title="Open Ink Assistant">
              <div className="ed-ai-orb" />
            </button>
          )}
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
              onChange={handleTitleChange}
            />
            <div
              ref={editorRef}
              className="ed-editor"
              contentEditable
              suppressContentEditableWarning
              onInput={handleEditorInput}
              data-placeholder="Start your story here..."
            >
              {INITIAL_CONTENT.map((p, i) => (
                <p key={i} className="ed-para">{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* AI Panel */}
        {panelOpen && (
          <aside className="ed-panel">

            {/* Panel Header */}
            <div className="ed-panel-header">
              <div className="ed-panel-title">
                <div className="ed-ai-orb" />
                <span>Ink Assistant</span>
              </div>
              <button className="ed-panel-close" onClick={() => setPanelOpen(false)}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 20, height: 20 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="ed-quick-actions">
              {[
                { label: "Correct", path: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
                { label: "Rewrite", path: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
                { label: "Suggest", path: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
              ].map(({ label, path }) => (
                <button key={label} className="ed-quick-btn">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 20, height: 20 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
                  </svg>
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Chat */}
            <div className="ed-chat">
              {messages.map((msg) =>
                msg.role === "suggestion" ? (
                  <div key={msg.id} className="ed-suggestion-card">
                    <span className="ed-suggestion-label">Plot Idea</span>
                    <p className="ed-suggestion-text">{msg.text}</p>
                    <div className="ed-suggestion-actions">
                      <button className="ed-apply-btn">Apply to text</button>
                      <button className="ed-ignore-btn">Ignore</button>
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className={`ed-msg-wrap ${msg.role === "user" ? "ed-msg-user" : "ed-msg-ai"}`}>
                    <div className={`ed-msg-bubble ${msg.role === "user" ? "ed-bubble-user" : "ed-bubble-ai"}`}>
                      {msg.text}
                    </div>
                    <span className="ed-msg-time">{msg.time}</span>
                  </div>
                )
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="ed-input-area">
              <div className="ed-autosuggest-row">
                <span className="ed-autosuggest-label">Ink Auto-suggestions</span>
                <button
                  className={`ed-toggle ${autoSuggest ? "ed-toggle-on" : "ed-toggle-off"}`}
                  onClick={() => setAutoSuggest(!autoSuggest)}
                  aria-label="Toggle auto-suggestions"
                >
                  <span className={`ed-toggle-thumb ${autoSuggest ? "ed-thumb-on" : "ed-thumb-off"}`} />
                </button>
              </div>
              <div className="ed-textarea-wrap">
                <textarea
                  className="ed-textarea"
                  placeholder="Ask Ink anything..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendAI(); } }}
                />
                <button className="ed-send-btn" onClick={handleSendAI}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 16, height: 16 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </button>
              </div>
            </div>

          </aside>
        )}

        {/* Floating open button when panel closed */}
        {!panelOpen && (
          <button className="ed-float-btn" onClick={() => setPanelOpen(true)} title="Open Ink Assistant">
            <div className="ed-ai-orb ed-orb-lg" />
          </button>
        )}

      </main>
    </div>
  );
}