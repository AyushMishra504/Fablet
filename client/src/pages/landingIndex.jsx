import React, { useState } from "react";
import "../styles/landing.css";
import { useNavigate } from "react-router-dom";

function LandingIndex() {
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate();

  const features = [
    {
      title: "Intelligent Writing Modes",
      description:
        "Choose how Fablet assists you—conversational chatbot, on-demand suggestions, or real-time auto-suggestions as you type.",
      icon: "💬",
    },
    {
      title: "Professional Editing",
      description:
        "Get instant spell and grammar corrections, plus intelligent sentence rewrites that enhance clarity and style.",
      icon: "✍️",
    },
    {
      title: "Creative Assistance",
      description:
        "Generate plot ideas, develop compelling characters, craft perfect titles, and bring your story to life with AI-generated images.",
      icon: "✨",
    },
    {
      title: "Share Your Work",
      description:
        "Publish stories for the community or keep them private. Control your drafts and published works with ease.",
      icon: "📚",
    },
  ];

  const writingModes = [
    { name: "Chatbot Mode", desc: "Conversational AI partner" },
    { name: "On-Demand", desc: "Suggestions when you ask" },
    { name: "Auto-Suggest", desc: "Real-time writing assistance" },
  ];

  const capabilities = [
    "Spell & Grammar Correction",
    "Sentence Rewriting",
    "Plot Ideas Generation",
    "Character Development",
    "Title Suggestions",
    "Story-to-Image Generation",
  ];

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">Fablet</div>
        <div className="navbar-buttons">
          <button className="btn-signin">Sign In</button>
          <button className="btn-primary" onClick={() => navigate("/register")}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">AI-Powered Writing Assistant</div>

        <h1 className="hero-title">
          Write Anything.
          <br />
          Write Everything.
        </h1>

        <p className="hero-description">
          From research papers to epic stories, Fablet adapts to your writing
          style. Customize your experience, get intelligent suggestions, and
          bring your ideas to life.
        </p>

        <button className="btn-cta" onClick={() => navigate("/register")}>
          Start Writing for Free
        </button>

        {/* Writing Modes Pills */}
        <div className="writing-modes">
          {writingModes.map((mode, idx) => (
            <div key={idx} className="mode-pill">
              <div className="mode-name">{mode.name}</div>
              <div className="mode-desc">{mode.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">Everything You Need to Write</h2>

          <div className="features-grid">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`feature-card ${activeFeature === idx ? "active" : ""}`}
                onMouseEnter={() => setActiveFeature(idx)}
                onMouseLeave={() => setActiveFeature(0)}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="capabilities-section">
        <h2 className="section-title">Powerful Tools at Your Fingertips</h2>

        <div className="capabilities-grid">
          {capabilities.map((capability, idx) => (
            <div key={idx} className="capability-item">
              <div className="capability-dot" />
              <span className="capability-text">{capability}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="community-section">
        <div className="community-container">
          <h2 className="section-title">Write, Share, Connect</h2>
          <p className="community-description">
            Keep your drafts private or publish your stories to share with the
            community. You decide what the world gets to see.
          </p>

          <div className="community-features">
            <div className="community-card">
              <div className="community-icon">📝</div>
              <div className="community-card-title">Private Drafts</div>
              <div className="community-card-desc">Your eyes only</div>
            </div>

            <div className="community-card">
              <div className="community-icon">🌍</div>
              <div className="community-card-title">Public Stories</div>
              <div className="community-card-desc">Share with everyone</div>
            </div>

            <div className="community-card">
              <div className="community-icon">💬</div>
              <div className="community-card-title">Engage</div>
              <div className="community-card-desc">Likes & comments</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to Transform Your Writing?</h2>
        <p className="cta-description">
          Join writers who are creating their best work with Fablet
        </p>
        <button className="btn-cta" onClick={() => navigate("/register")}>
          Get Started Free
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo">Fablet</div>
        <p>© 2026 Fablet. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingIndex;
