import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import ConfirmPublishStory from "./ConfirmPublishStory";
import "../styles/editor.css";

const INITIAL_CONTENT = ["Start writing your story here..."];

const GENRE_OPTIONS = [
  "Fantasy", "Sci-Fi", "Romance", "Mystery", "Thriller", "Horror",
  "Literary Fiction", "Historical", "Adventure", "Comedy", "Drama",
  "Non-Fiction", "Research", "Philosophy", "Journal", "Health",
];

const LANGUAGE_OPTIONS = [
  "English", "Hindi", "Spanish", "French", "German", "Portuguese",
  "Japanese", "Korean", "Chinese", "Arabic", "Russian", "Other",
];

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
  const [panelOpen, setPanelOpen] = useState(false);
  const [autoSuggest, setAutoSuggest] = useState(true);
  const [saveStatus, setSaveStatus] = useState("saved"); // "unsaved" | "saving" | "saved" | "error"
  const [wordCount, setWordCount] = useState(0);
  const [aiInput, setAiInput] = useState("");
  const [messages, setMessages] = useState(AI_MESSAGES);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false, quote: false, chapter: false });
  const [showSettings, setShowSettings] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [storySettings, setStorySettings] = useState({
    description: "",
    genre: [],
    tags: [],
    language: "English",
    contentRating: "everyone",
    penName: "",
    visibility: "private",
    status: "draft",
    coverImage: "",
  });
  const [tagInput, setTagInput] = useState("");
  const editorRef = useRef(null);
  const canvasRef = useRef(null);
  const chatEndRef = useRef(null);
  const coverInputRef = useRef(null);

  // ── Formatting handler ──
  const applyFormat = useCallback((format) => {
    // Ensure focus is on the editor
    editorRef.current?.focus();
    if (format === "quote") {
      const isQuote = document.queryCommandValue("formatBlock") === "blockquote";
      document.execCommand("formatBlock", false, isQuote ? "p" : "blockquote");
    } else if (format === "chapter") {
      const isH2 = document.queryCommandValue("formatBlock") === "h2";
      document.execCommand("formatBlock", false, isH2 ? "p" : "h2");
    } else if (format === "break") {
      document.execCommand("insertHorizontalRule");
      // Move cursor after the HR
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.collapse(false);
      }
    } else {
      document.execCommand(format);
    }
    // Update active state
    const fmtBlock = document.queryCommandValue("formatBlock");
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      quote: fmtBlock === "blockquote",
      chapter: fmtBlock === "h2",
    });
  }, []);

  // Track active formatting when selection changes
  useEffect(() => {
    const updateFormats = () => {
      if (!editorRef.current?.contains(document.activeElement) && document.activeElement !== editorRef.current) return;
      const fmtBlock = document.queryCommandValue("formatBlock");
      setActiveFormats({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        quote: fmtBlock === "blockquote",
        chapter: fmtBlock === "h2",
      });
    };
    document.addEventListener("selectionchange", updateFormats);
    return () => document.removeEventListener("selectionchange", updateFormats);
  }, []);

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
          content: editorRef.current?.innerHTML || content,
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

  // ── Typewriter scroll: keep cursor vertically centered ──
  const scrollCursorToCenter = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const cursorRelY = rect.top - canvasRect.top + canvas.scrollTop;
    const targetScroll = cursorRelY - canvas.clientHeight / 2;
    canvas.scrollTo({ top: targetScroll, behavior: "smooth" });
  }, []);

  // Word count from editor
  const handleEditorInput = () => {
    const text = editorRef.current?.innerText || "";
    setContent(text);
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setSaveStatus("unsaved");
    // Typewriter: scroll cursor to center after every input
    requestAnimationFrame(scrollCursorToCenter);
  };

  // Also handle Enter key and arrow keys for typewriter
  const handleEditorKeyDown = (e) => {
    if (e.key === "Enter" || e.key.startsWith("Arrow")) {
      requestAnimationFrame(() => requestAnimationFrame(scrollCursorToCenter));
    }
  };

  // ── Focus mode keyboard shortcut ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Shift+F to toggle focus mode
      if (e.ctrlKey && e.shiftKey && e.key === "F") {
        e.preventDefault();
        setFocusMode((prev) => !prev);
      }
      // Escape to exit focus mode
      if (e.key === "Escape" && focusMode) {
        setFocusMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusMode]);
useEffect(() => {
  const fetchStory = async () => {
    const res = await fetch(`/api/stories/${id}`, {
      credentials: "include",
    });

    const data = await res.json();

    if (data.status === "published") {
      navigate(`/view/${id}`);
      return;
    }

    setTitle(data.title || "");

    if (editorRef.current) {
      editorRef.current.innerHTML = data.content || "";
      const plainText = (data.content || "").replace(/<[^>]*>/g, " ");
      const words = plainText.trim().split(/\s+/).filter(Boolean).length;
      setWordCount(words);
    }

    // Load settings
    setStorySettings({
      description: data.description || "",
      genre: data.genre || [],
      tags: data.tags || [],
      language: data.language || "English",
      contentRating: data.contentRating || "everyone",
      penName: data.penName || "",
      visibility: data.visibility || "private",
      status: data.status || "draft",
      coverImage: data.coverImage || "",
    });
    
    setSaveStatus("saved");
  };

  if (id) fetchStory();
}, [id, navigate]);

  // ── Cover image upload ──
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    try {
      const formData = new FormData();
      formData.append("cover", file);
      const res = await fetch(`/api/stories/${id}/cover`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setStorySettings((prev) => ({ ...prev, coverImage: data.coverImage }));
      }
    } catch (err) {
      console.error("Cover upload failed", err);
    } finally {
      setCoverUploading(false);
      e.target.value = "";
    }
  };

  const handleCoverRemove = async () => {
    try {
      await fetch(`/api/stories/${id}/cover`, {
        method: "DELETE",
        credentials: "include",
      });
      setStorySettings((prev) => ({ ...prev, coverImage: "" }));
    } catch (err) {
      console.error("Cover remove failed", err);
    }
  };

  // ── Save settings ──
  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    try {
      const res = await fetch(`/api/stories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          description: storySettings.description,
          genre: storySettings.genre,
          tags: storySettings.tags,
          language: storySettings.language,
          contentRating: storySettings.contentRating,
          penName: storySettings.penName,
          visibility: storySettings.visibility,
          status: storySettings.status,
        }),
      });
      if (res.ok) {
        setShowSettings(false);
      }
    } catch (err) {
      console.error("Settings save failed", err);
    } finally {
      setSettingsSaving(false);
    }
  };

  const toggleGenre = (g) => {
    setStorySettings((prev) => ({
      ...prev,
      genre: prev.genre.includes(g)
        ? prev.genre.filter((x) => x !== g)
        : prev.genre.length < 3 ? [...prev.genre, g] : prev.genre,
    }));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (!t || storySettings.tags.length >= 5 || storySettings.tags.includes(t)) return;
    setStorySettings((prev) => ({ ...prev, tags: [...prev.tags, t] }));
    setTagInput("");
  };

  const removeTag = (t) => {
    setStorySettings((prev) => ({ ...prev, tags: prev.tags.filter((x) => x !== t) }));
  };

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
    <div className={`ed-root ${dark ? "ed-dark" : ""} ${focusMode ? "ed-focus-mode" : ""}`}>

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
              { title: "Bold", cmd: "bold", path: "M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" },
              { title: "Italic", cmd: "italic", path: "M10 20l4-16m-4 0h4m-6 16h4" },
              { title: "Quote", cmd: "quote", path: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
            ].map(({ title, cmd, path }) => (
              <button
                key={title}
                className={`ed-toolbar-btn ${activeFormats[cmd] ? "ed-toolbar-btn-active" : ""}`}
                title={title}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFormat(cmd)}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 20, height: 20 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
                </svg>
              </button>
            ))}

            <div className="ed-toolbar-sep" />

            {/* Chapter heading */}
            <button
              className={`ed-toolbar-btn ${activeFormats.chapter ? "ed-toolbar-btn-active" : ""}`}
              title="Chapter Heading"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFormat("chapter")}
            >
              <span style={{ fontWeight: 700, fontSize: '14px', fontFamily: 'Crimson Pro, serif', lineHeight: 1 }}>H2</span>
            </button>

            {/* Chapter break / page divider */}
            <button
              className="ed-toolbar-btn"
              title="Chapter Break"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFormat("break")}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 20, height: 20 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16M4 6h4m-4 12h4m8-12h4m-4 12h4" />
              </svg>
            </button>
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

          <ConfirmPublishStory storyId={id} className="ed-publish-btn" title={title} content={content} />
          {!panelOpen && (
            <button className="ed-open-panel-btn" onClick={() => setPanelOpen(true)} title="Open Ink Assistant">
              <div className="ed-ai-orb" />
            </button>
          )}
          <button
            className={`ed-focus-toggle-btn ${focusMode ? "ed-focus-active" : ""}`}
            onClick={() => setFocusMode(!focusMode)}
            title={focusMode ? "Exit Focus Mode (Esc)" : "Enter Focus Mode (Ctrl+Shift+F)"}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      {/* ── Focus mode exit bar ── */}
      {focusMode && (
        <div className="ed-focus-exit-bar">
          <span className="ed-focus-word-count">{wordCount.toLocaleString()} {wordCount === 1 ? "word" : "words"}</span>
          <button className="ed-focus-exit-btn" onClick={() => setFocusMode(false)}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 14, height: 14 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Exit Focus
          </button>
        </div>
      )}

      <main className="ed-body">

        {/* Writing Canvas */}
        <section className="ed-canvas" ref={canvasRef}>
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
              onKeyDown={handleEditorKeyDown}
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

      {/* ── Story Settings Modal ── */}
      {showSettings && (
        <div className="ss-overlay" onClick={() => setShowSettings(false)}>
          <div className="ss-panel" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="ss-header">
              <h2 className="ss-title">Story Settings</h2>
              <button className="ss-close" onClick={() => setShowSettings(false)}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 20, height: 20 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="ss-body">

              {/* Cover Image */}
              <div className="ss-section">
                <label className="ss-label">Cover Image</label>
                <div className="ss-cover-area">
                  {storySettings.coverImage ? (
                    <div className="ss-cover-preview">
                      <img src={storySettings.coverImage} alt="Cover" className="ss-cover-img" />
                      <div className="ss-cover-actions">
                        <button className="ss-cover-change" onClick={() => coverInputRef.current?.click()}>
                          {coverUploading ? "Uploading..." : "Change"}
                        </button>
                        <button className="ss-cover-remove" onClick={handleCoverRemove}>Remove</button>
                      </div>
                    </div>
                  ) : (
                    <button className="ss-cover-upload" onClick={() => coverInputRef.current?.click()} disabled={coverUploading}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 32, height: 32 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{coverUploading ? "Uploading..." : "Upload Cover Image"}</span>
                      <span className="ss-cover-hint">JPG, PNG up to 5MB</span>
                    </button>
                  )}
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="ss-section">
                <label className="ss-label">Description / Synopsis</label>
                <textarea
                  className="ss-textarea"
                  placeholder="A short blurb about your story..."
                  maxLength={500}
                  value={storySettings.description}
                  onChange={(e) => setStorySettings((p) => ({ ...p, description: e.target.value }))}
                />
                <span className="ss-char-count">{storySettings.description.length}/500</span>
              </div>

              {/* Genre */}
              <div className="ss-section">
                <label className="ss-label">Genre <span className="ss-hint">(up to 3)</span></label>
                <div className="ss-genre-grid">
                  {GENRE_OPTIONS.map((g) => (
                    <button
                      key={g}
                      className={`ss-genre-chip ${storySettings.genre.includes(g) ? "ss-chip-active" : ""}`}
                      onClick={() => toggleGenre(g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="ss-section">
                <label className="ss-label">Tags <span className="ss-hint">(up to 5)</span></label>
                <div className="ss-tags-wrap">
                  {storySettings.tags.map((t) => (
                    <span key={t} className="ss-tag">
                      {t}
                      <button className="ss-tag-remove" onClick={() => removeTag(t)}>&times;</button>
                    </span>
                  ))}
                  {storySettings.tags.length < 5 && (
                    <input
                      className="ss-tag-input"
                      placeholder="Add tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    />
                  )}
                </div>
              </div>

              {/* Language */}
              <div className="ss-section">
                <label className="ss-label">Language</label>
                <select
                  className="ss-select"
                  value={storySettings.language}
                  onChange={(e) => setStorySettings((p) => ({ ...p, language: e.target.value }))}
                >
                  {LANGUAGE_OPTIONS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              {/* Content Rating */}
              <div className="ss-section">
                <label className="ss-label">Content Rating</label>
                <div className="ss-rating-group">
                  {[
                    { value: "everyone", label: "Everyone", desc: "Suitable for all ages" },
                    { value: "teen", label: "Teen (13+)", desc: "May contain mild themes" },
                    { value: "mature", label: "Mature (18+)", desc: "Adult content" },
                  ].map(({ value, label, desc }) => (
                    <label key={value} className={`ss-rating-option ${storySettings.contentRating === value ? "ss-rating-active" : ""}`}>
                      <input
                        type="radio"
                        name="contentRating"
                        value={value}
                        checked={storySettings.contentRating === value}
                        onChange={(e) => setStorySettings((p) => ({ ...p, contentRating: e.target.value }))}
                        style={{ display: "none" }}
                      />
                      <span className="ss-rating-label">{label}</span>
                      <span className="ss-rating-desc">{desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pen Name */}
              <div className="ss-section">
                <label className="ss-label">Pen Name <span className="ss-hint">(optional)</span></label>
                <input
                  className="ss-input"
                  placeholder="Your display name for this story"
                  value={storySettings.penName}
                  onChange={(e) => setStorySettings((p) => ({ ...p, penName: e.target.value }))}
                />
              </div>

              {/* Visibility */}
              <div className="ss-section">
                <label className="ss-label">Visibility</label>
                <div className="ss-visibility-row">
                  <span className="ss-vis-text">{storySettings.visibility === "public" ? "Public — anyone can read" : "Private — only you can see"}</span>
                  <button
                    className={`ed-toggle ${storySettings.visibility === "public" ? "ed-toggle-on" : "ed-toggle-off"}`}
                    onClick={() => setStorySettings((p) => ({ ...p, visibility: p.visibility === "public" ? "private" : "public" }))}
                  >
                    <span className={`ed-toggle-thumb ${storySettings.visibility === "public" ? "ed-thumb-on" : "ed-thumb-off"}`} />
                  </button>
                </div>
              </div>

              {/* Publish */}
              <div className="ss-section ss-publish-section">
                <div className="ss-publish-status">
                  <span className={`ss-status-dot ${storySettings.status === "published" ? "ss-dot-published" : "ss-dot-draft"}`} />
                  <span>Currently: <strong>{storySettings.status === "published" ? "Published" : "Draft"}</strong></span>
                </div>
                <button
                  className={`ss-publish-btn ${storySettings.status === "published" ? "ss-unpublish" : "ss-publish"}`}
                  onClick={() => setStorySettings((p) => ({ ...p, status: p.status === "published" ? "draft" : "published" }))}
                >
                  {storySettings.status === "published" ? "Unpublish" : "Publish Story"}
                </button>
              </div>

            </div>

            {/* Footer */}
            <div className="ss-footer">
              <button className="ss-cancel" onClick={() => setShowSettings(false)}>Cancel</button>
              <button className="ss-save" onClick={handleSaveSettings} disabled={settingsSaving}>
                {settingsSaving ? "Saving..." : "Save Settings"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}