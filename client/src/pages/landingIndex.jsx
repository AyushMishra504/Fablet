import { useTheme } from "../ThemeContext";
import "../styles/landing.css";
import { Link, useNavigate } from "react-router-dom";

const Icon = ({ name }) => (
  <span className="material-symbols-outlined">{name}</span>
);

const DarkModeToggle = ({ dark, setDark }) => (
  <button
    onClick={() => setDark(!dark)}
    className={`toggle-btn ${dark ? "toggle-on" : "toggle-off"}`}
    aria-label="Toggle dark mode"
  >
    <span className={`toggle-thumb ${dark ? "thumb-on" : "thumb-off"}`}>
      <span className="material-symbols-outlined toggle-icon">
        {dark ? "dark_mode" : "light_mode"}
      </span>
    </span>
  </button>
);

export default function App() {
  const { dark, setDark } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`app ${dark ? "dark" : "light"}`}>
      {/* NAVBAR */}
      <header className="navbar">
        <div className="nav-logo">
          <Icon name="auto_stories" />
          <span className="nav-brand">Fablet</span>
        </div>
        <nav className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <Link to="/pricing" className="nav-link">Pricing</Link>
          <Link to="/community" className="nav-link">Community</Link>
        </nav>
        <div className="nav-actions">
          <DarkModeToggle dark={dark} setDark={setDark} />
          <button className="btn-login" onClick={() => navigate("/login")}>Login</button>
          <button className="btn-primary" onClick={() => navigate("/register")}>Get Started</button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid">
          {/* Left */}
          <div className="hero-content">
            <div className="badge">
              <Icon name="bolt" /> Introducing Ink AI
            </div>
            <h1 className="hero-title">
              Write your masterpiece with{" "}
              <span className="text-primary">AI precision.</span>
            </h1>
            <p className="hero-subtitle">
              Ink by Fablet transforms your creative process with intelligent
              editing, deep plot generation, and distraction-free story
              management.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary btn-lg" onClick={() => navigate("/register")}>Start Writing Free</button>
              <button className="btn-outline btn-lg">Watch Demo</button>
            </div>
            <div className="hero-social-proof">
              <div className="avatar-stack">  
                {[
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuCd9K7kbB7Y26vRgsbkEL5Uoo12yAzMUCkHUMm6oqs3QeRwmf823pMw47yRGXNnQbM3zwgXthxcZv8UoXxInV8taAxpPUtGVZIXADqW7l6sW_yXuTocpL61FFQH4MZ_rAuHxPHeIga_FRpPkSoVXvxHggESBefIbfy4Hm7cPViZBR9GxYhrz5PlYsD0T764kVWj-lV8xyN6XOVMrNDKmiS5iDltE73gGElDxOkBxoc9gKb3mB6k57CmBJB19PO0KLcZ9I_KL0qF_Yk",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuB9h4ceiH-2H2HfVRQw9sLS4B-_NsMODNWR5GaF8QoAVzkdppy7yqX9pvQOjTPtPWwiEj1mBFSZUyCm4aBxT94GDy1wKwlde5xLIcrG0HYLT4wQ-Jpb8dYo4sMGgwxQDAu-tmUx1VIk-XXwOEadpmvaOVVhTaMW1659gS6-HqcW24dW_DMTOYHnICiTaNQPepPNWxvpqsN0C_Fw8F7y2gj0-LGSEVmRRPMSnt203YD2SreOsH-KQnVJYw_LSG3sUiMsbLn5JRHctSs",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuDagKIqigR2bs2EEDl72H4oP30vKNNYd3GeNiWDItHaiocj2JNBbTudgKGm7jW0QiB1vw2psMVZRiCJ-njjIKXFC9OoW6W2Zoqll0SYaGIiwe5SKbg-dXPCsBo_LoNKVhqH4tSSnbsArYbku1dGqr_ZujTzxIFf3QtVzOdp6yzpgT-7tWKa4iTckS5gpIqtyXKQ_Os8QQMERUhXhzZUxKAxe6W_HvO1xwm3KzUlITgt8GKxIuSKxDO5dpQqDcmfn7rM-AlTvOdJZkg",
                ].map((src, i) => (
                  <img key={i} src={src} alt="User avatar" className="avatar" />
                ))}
              </div>
              <p className="social-proof-text">Joined by 20,000+ storytellers</p>
            </div>
          </div>

          {/* Right - Hero Image */}
          <div className="hero-image-wrapper">
            <div className="hero-glow" />
            <div className="hero-image-card">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdqzKu5brXWYaBcbHyXv9UIz-7OOMBG9xXZu_VqS4QpQX5PHElbrABN4TScBhfd9NdL4_9zjTrHJRXOEDtR0cXmhvrcJrEg95uo9lbn93lmjyjgk7VOFOu4hjscd_BUyTyWiOPIG7LHIE3sUmyaPDETAWQa-205gHCoY_hgw89e_BP0X8agwCgZoI0pcImNDPQYTT9I_NArai1d5azCw79p4zzwoq6YnLPUte6Yld5TB1vU7FDs3lvQKy7rJx4ZLGGum25OPqU_E4"
                alt="Writing workspace"
                className="hero-img"
              />
              <div className="hero-quote-card">
                <div className="quote-dots">
                  <span className="dot dot-primary" />
                  <span className="dot dot-muted" />
                  <span className="dot dot-muted" />
                </div>
                <p className="quote-text">
                  "The AI suggested a plot twist that changed everything. My
                  draft finally feels alive."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">The Craft</p>
            <h2 className="section-title">
              Powerful tools for the modern author.
            </h2>
            <p className="section-subtitle">
              Experience a suite of AI-assisted features designed to enhance
              your storytelling without losing your unique voice.
            </p>
          </div>
          <div className="features-grid">
            {[
              {
                icon: "edit_note",
                title: "Intelligent Editing",
                desc: "Real-time suggestions to refine your prose, adjust tone, and perfect grammar without interrupting your flow.",
              },
              {
                icon: "lightbulb_circle",
                title: "Plot Assistance",
                desc: "Overcome writer's block with context-aware plot ideas, character arcs, and world-building sparks.",
              },
              {
                icon: "folder_managed",
                title: "Story Management",
                desc: "Keep your chapters, character sheets, and research organized in one elegant, distraction-free interface.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="feature-card">
                <div className="feature-icon">
                  <Icon name={icon} />
                </div>
                <div>
                  <h3 className="feature-title">{title}</h3>
                  <p className="feature-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CINEMATIC SECTION */}
      <section className="cinematic-section">
        <div className="container">
          <div className="cinematic-card">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0xCfWOx_iqJs0tPjd_3z0sb0uYhfpuT4s08XkNf5WwrKxPWr1rXG6ZaRXBaZ3a00D35JJSBsWhkPb414u4Q9SN1MX73y3P2BEMZjqwk9I1Uw6P701naFG1WiFr-RtFLQhDOX2xRk0nZaZxM6DtWI3pJEGae4FmNzSyaR_Lm_uchr9T6snBGaIPeRqcuL2awVzCnlj2l_Ojsp7T3zWM7yNHWtpDT0Y5FWdEQNjtkHVYteGMKi_1qa9szsu3AvAfFiy_mVCaPGBzcQ"
              alt="Cozy writing nook"
              className="cinematic-img"
            />
            <div className="cinematic-overlay">
              <div className="cinematic-content">
                <h2 className="cinematic-title">
                  Built for the deep work of writing.
                </h2>
                <p className="cinematic-desc">
                  We believe technology should amplify the author, not replace
                  them. Every feature in Fablet is tuned for the quiet moments
                  of creation.
                </p>
                <div className="cinematic-perks">
                  {["Dark Mode Native", "Cloud Syncing", "Offline First"].map(
                    (item) => (
                      <div key={item} className="perk">
                        <Icon name="check_circle" />
                        {item}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to start your next chapter?</h2>
          <p className="cta-subtitle">
            Join thousands of writers who are crafting better stories, faster,
            with Fablet. No credit card required to start.
          </p>
          <button className="btn-cta" onClick={() => navigate("/register")} >Sign Up Now — It's Free</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <Icon name="auto_stories" />
            <span>Fablet</span>
          </div>
          <div className="footer-links">
            {["Privacy Policy", "Terms of Service", "Contact", "Twitter"].map(
              (link) => (
                <a key={link} href="/" className="footer-link">
                  {link}
                </a>
              )
            )}
          </div>
          <p className="footer-copy">© 2024 Fablet Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}