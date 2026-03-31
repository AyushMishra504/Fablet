import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const [panelOpen, setPanelOpen] = useState(true);
  const [autoSuggest, setAutoSuggest] = useState(true);
  const [saveStatus, setSaveStatus] = useState("unsaved"); // "unsaved" | "saving" | "saved" | "error"
  const [wordCount, setWordCount] = useState(0);
  const [aiInput, setAiInput] = useState("");
  const [messages, setMessages] = useState(AI_MESSAGES);
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
    }
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
    <div className="ed-root">

      {/* ── Header ── */}
      <header className="ed-header">
        <div className="ed-header-left">
          <button className="ed-logo-btn" onClick={() => navigate("/Dashboard")}>
            <div className="ed-logo-icon">F</div>
            <span className="ed-logo-text">Fablet</span>
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
          <span className="ed-wordcount">{wordCount.toLocaleString()} words</span>
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