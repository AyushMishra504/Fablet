/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import "../styles/register.css";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
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
      const res = await apiFetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // user already exists
        if (res.status === 409) {
          setError(data.message);
          return;
        }
        // Validation errors
        if (res.status === 400 && Array.isArray(data)) {
          setError(data);
          return;
        }
        // Any other error
        setError(data.message || "Something went wrong. Please try again.");
        return;
      }

      setSuccess("Account created successfully!");
      setFormData({ name: "", email: "", password: "" });
      setTimeout(() => navigate("/Dashboard"), 500);
    } catch (err) {
      console.error(err);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-page">
      <div className="reg-wrapper">

        {/* Logo */}
        <div className="reg-logo-section">
          <div className="reg-logo-icon">
            <span className="material-symbols-outlined">auto_stories</span>
          </div>
          <h1 className="reg-brand">Fablet</h1>
          <p className="reg-tagline">Where stories find their home.</p>
        </div>

        {/* Card */}
        <div className="reg-card">

          {/* Hero Image */}
          <div className="reg-card-image">
            <div
              className="reg-card-image-bg"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBTeeb7ZOHo9ERiKGxyd1YlPotdXdAxxCPoNXhQJvNUoL5n9wLEvqDj0zACequ511VZA4MgpJLFZdPZmXvLriOvBk0gnPUnz8Fhi3__QbfC5Ieyvt8FfYkiPmQOJiIvo8BhpnlXeb7A83N1rPhKovpQJDPKhUPc_Pck3zqL7zbXxHjQIGrNqtr5u5M7X3jDPApjdS9CmXdHs2lHEVC-UZulkaaSL5wcefcIrWhmiFINS8vJZ_Qr2sUy6JOl8VZvRg_SZQgiFhiu3CI')`,
              }}
            />
            <div className="reg-card-image-fade" />
          </div>

          {/* Form Body */}
          <div className="reg-card-body">
            <div className="reg-card-header">
              <button className="reg-back-btn" onClick={() => navigate("/")}>‹ Back</button>
              <h2 className="reg-card-title">Begin Your Story</h2>
              <p className="reg-card-subtitle">Create an account to join the Fablet community.</p>
            </div>

            <form onSubmit={handleSubmit} className="reg-form">

              {/* Name */}
              <div className="reg-field">
                <label htmlFor="name" className="reg-label">Full Name</label>
                <div className="reg-input-wrap">
                  <span className="material-symbols-outlined reg-input-icon">person</span>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="reg-input"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="reg-field">
                <label htmlFor="email" className="reg-label">Email Address</label>
                <div className="reg-input-wrap">
                  <span className="material-symbols-outlined reg-input-icon">mail</span>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="name@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="reg-input"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="reg-field">
                <label htmlFor="password" className="reg-label">Password</label>
                <div className="reg-input-wrap">
                  <span className="material-symbols-outlined reg-input-icon">lock</span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className="reg-input reg-input-password"
                    required
                  />
                  <button
                    type="button"
                    className="reg-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <button type="submit" className="reg-submit-btn" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Error Handling — unchanged from your original */}
            {Array.isArray(error) && (
              <div className="reg-error-box">
                <ul className="reg-error-list">
                  {error.map((err, idx) => (
                    <li key={idx}>{err.msg}</li>
                  ))}
                </ul>
              </div>
            )}
            {typeof error === "string" && <p className="reg-error-text">{error}</p>}
            {success && <p className="reg-success-text">{success}</p>}

            {/* Divider */}
            <div className="reg-divider">
              <span className="reg-divider-line" />
              <span className="reg-divider-text">Or continue with</span>
              <span className="reg-divider-line" />
            </div>

            {/* Social Buttons */}
            <div className="reg-social-grid">
              <button type="button" className="reg-social-btn">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuANCPfuO-11CSkvL5Fzza-B4ECAlziFXmMluMxCT0VXIPx15kJO8b3lg3M9a0Vgapk_j0peFQEFnCGpIsaL1w50wvL-kHdbTc1qt5g8lz-X66AdoldMdGq--i31quPHXTE2tylP5G5PEml7LfStwdzkBQJYuDfG8wObLk7aSZqIyCmphC30n_PL-NRPFc8aF0Yf9fFRgzXlaYar6a2DElxw0ACd7O-kTWjF-2bZHEnR7Tsw3odewCjUPSVKn0bkZkDnlQHO2rF_-Rw"
                  alt="Google"
                  className="reg-social-icon-img"
                />
                <span>Google</span>
              </button>
              <button type="button" className="reg-social-btn">
                <span className="material-symbols-outlined reg-social-icon">ios</span>
                <span>Apple</span>
              </button>
            </div>

          </div>
        </div>

        {/* Footer */}
        <p className="reg-footer-text">
          Already have an account?{" "}
          <a href="/login" className="reg-footer-link">Sign In</a>
        </p>
        <p className="reg-terms">
          By clicking "Create Account", you agree to Fablet's{" "}
          <a href="#" className="reg-terms-link">Terms of Service</a> and{" "}
          <a href="#" className="reg-terms-link">Privacy Policy</a>.
        </p>

      </div>
    </div>
  );
};

export default Register;