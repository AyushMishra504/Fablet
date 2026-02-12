import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';

function LandingIndex() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigate to register page
  const handleSignIn = () => {
    navigate('/register');
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <header className="hero-header">
            <h1 className="hero-title">FABLET</h1>
            <p className="hero-subtitle">
              Begin your journey starting creating on Fablet with
              <br />
              AI to assist you wherever you are stuck
            </p>
          </header>

          <div className="cta-buttons">
            <button className="btn btn-primary" onClick={handleSignIn}>
              Sign in with your account
            </button>
            <button className="btn btn-secondary" onClick={handleCreateAccount}>
              Create Account
            </button>
          </div>

          <div className="app-preview-container">
            <div className="app-preview">
              {/* Placeholder - Replace with your actual image */}
              <div className="preview-placeholder">
                <div className="placeholder-icon">📚</div>
                <p className="placeholder-text">App Dashboard Preview</p>
                <p className="placeholder-hint">Replace this div with your screenshot</p>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <span className="scroll-text">Scroll to explore</span>
          <span className="scroll-arrow">↓</span>
        </div>
      </section>

      {/* Main Content Section */}
      <main className="main-content">
        <section className="explore-section">
          <h2 className="section-title">Explore what you can do on Fablet</h2>

          <div className="content-grid">
            {/* Features Section */}
            <section className="content-block features-block">
              <div className="block-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className="block-title">Features</h3>
              <p className="block-description">
                Discover powerful tools designed for modern storytellers. 
                Organize your ideas, develop characters, and build immersive worlds 
                with intelligent features that adapt to your creative process.
              </p>
            </section>

            {/* Writing Tools Section */}
            <section className="content-block tools-block">
              <div className="block-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <h3 className="block-title">Writing Tools</h3>
              <p className="block-description">
                Access a comprehensive suite of writing tools including advanced 
                text editors, grammar assistance, style suggestions, and formatting 
                options that help you craft polished, professional content.
              </p>
            </section>

            {/* AI Assistance Section */}
            <section className="content-block ai-block">
              <div className="block-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
              </div>
              <h3 className="block-title">AI Assistance</h3>
              <p className="block-description">
                Let our intelligent AI guide you through creative blocks, 
                suggest plot developments, enhance dialogue, and provide 
                real-time feedback to elevate your storytelling to new heights.
              </p>
            </section>

            {/* Community Section */}
            <section className="content-block community-block">
              <div className="block-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3 className="block-title">Community & Stories</h3>
              <p className="block-description">
                Join a vibrant community of writers and readers. Share your work, 
                receive constructive feedback, discover inspiring stories, and 
                connect with fellow creators from around the world.
              </p>
            </section>
          </div>
        </section>

        {/* Additional Content Sections */}
        <section className="additional-content">
          <div className="feature-highlight">
            <h3 className="highlight-title">Start Your Creative Journey</h3>
            <p className="highlight-text">
              Whether you're writing your first story or your fiftieth novel, 
              Fablet provides the tools and support you need to bring your 
              ideas to life. From initial concept to final draft, we're with 
              you every step of the way.
            </p>
            <button className="btn btn-cta" onClick={handleCreateAccount}>
              Get Started Today
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h4 className="footer-logo">FABLET</h4>
            <p className="footer-tagline">
              AI-powered writing for storytellers
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h5 className="footer-heading">Product</h5>
              <ul className="footer-list">
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#templates">Templates</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h5 className="footer-heading">Resources</h5>
              <ul className="footer-list">
                <li><a href="#blog">Blog</a></li>
                <li><a href="#guides">Writing Guides</a></li>
                <li><a href="#community">Community</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h5 className="footer-heading">Company</h5>
              <ul className="footer-list">
                <li><a href="#about">About</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Fablet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingIndex;