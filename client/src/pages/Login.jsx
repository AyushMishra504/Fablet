/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

const Login = () => {
  const navigate = useNavigate();

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
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // handle both validation array & auth message
        if (Array.isArray(data)) {
          setError(data); // express-validator errors
        } else {
          setError(data.message); // auth errors
        }
        return;
      }

      setSuccess("Logged in successfully!");
      setFormData({
        email: "",
        password: "",
      });

      // Optional: Redirect to login or dashboard after success
      // setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="register-logo">Fablet</div>
          <h2 className="register-title">Login</h2>
          <p className="register-subtitle">Welcome back — let’s keep writing</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="btn-register" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Error Handling */}
        {Array.isArray(error) && (
          <div className="error-message">
            <ul className="error-list">
              {error.map((err, idx) => (
                <li key={idx} className="error-item">
                  {err.msg}
                </li>
              ))}
            </ul>
          </div>
        )}

        {typeof error === "string" && <p className="error-text">{error}</p>}

        {success && <p className="success-message">{success}</p>}

        <div className="register-footer">
          Don't have an account?{" "}
          <a href="/register" className="register-link">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
