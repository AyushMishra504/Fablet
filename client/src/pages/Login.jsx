/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (Array.isArray(data)) {
          setError(data);
        } else {
          setError(data.message);
        }
        return;
      }

      setSuccess("Logged in successfully!");
      setFormData({ email: "", password: "" });
      setTimeout(() => navigate("/Dashboard"), 500);
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">

        {/* Card */}
        <div className="login-card">

          {/* Header */}
          <div className="login-card-header">
            <div className="login-logo">
              <span className="material-symbols-outlined login-logo-icon">auto_stories</span>
              <h1 className="login-brand">Fablet</h1>
            </div>
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Enter your credentials to continue your story.</p>
          </div>

          {/* Decorative strip */}
          <div className="login-strip" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">

            {/* Email */}
            <div className="login-field">
              <label className="login-label">Email Address</label>
              <div className="login-input-wrap">
                <span className="material-symbols-outlined login-input-icon">mail</span>
                <input
                  type="email"
                  name="email"
                  placeholder="writer@fablet.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="login-input"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="login-label-row">
                <label className="login-label">Password</label>
                <a href="#" className="login-forgot">Forgot?</a>
              </div>
              <div className="login-input-wrap">
                <span className="material-symbols-outlined login-input-icon">lock</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="login-input login-input-password"
                  required
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="login-remember">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="login-checkbox"
              />
              <label htmlFor="remember" className="login-remember-label">
                Remember me for 30 days
              </label>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              <span>{loading ? "Logging in..." : "Log In"}</span>
              {!loading && <span className="material-symbols-outlined">login</span>}
            </button>
          </form>

          {/* Error Handling — same as your original */}
          {Array.isArray(error) && (
            <div className="login-error-box">
              <ul className="login-error-list">
                {error.map((err, idx) => (
                  <li key={idx}>{err.msg}</li>
                ))}
              </ul>
            </div>
          )}
          {typeof error === "string" && <p className="login-error-text">{error}</p>}
          {success && <p className="login-success-text">{success}</p>}

          {/* Divider */}
          <div className="login-social-section">
            <div className="login-divider">
              <span className="login-divider-line" />
              <span className="login-divider-text">Or continue with</span>
              <span className="login-divider-line" />
            </div>

            {/* Social */}
            <div className="login-social-grid">
              <button type="button" className="login-social-btn">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwczzPpOArqd5QbmbbOHkI2V8XIFEpjrt39ooIE8xe3kSy_MzYQob6Ihb8l2RiGmGH6W8RnunPaApF07Z1dRwAv5y_H30kp7jCOFmL6C3CbAOY7aego_-wNywJ_7Qy64CSNVVIVl_ATX8V2ZQOs9WgaHYiSf39DdzDTy0y18juafFLfUXPQAvw6YfnJ-YxNpNCWOYI1qAkA1UD58Sq6YbCL3eT9nsMlChK4IsBDBvM3l073ujUK_1eIt5SITz1ZQXf5ZaRr3cC_s0"
                  alt="Google"
                  className="login-social-img"
                />
                <span>Google</span>
              </button>
              <button type="button" className="login-social-btn">
                <span className="material-symbols-outlined login-social-icon">ios</span>
                <span>Apple</span>
              </button>
            </div>
          </div>

          {/* Sign up footer */}
          <div className="login-card-footer">
            <p className="login-footer-text">
              Don't have an account?{" "}
              <a href="/register" className="login-footer-link">Sign Up</a>
            </p>
          </div>
        </div>

        {/* Bottom links */}
        <div className="login-bottom-links">
          {["Privacy Policy", "Terms of Service", "Help Center"].map((link) => (
            <a key={link} href="#" className="login-bottom-link">{link}</a>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Login;