/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

const Register = () => {
  const navigate = useNavigate();

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
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        //user already exists
        if (res.status === 409) {
          setError(data.message);
          return;
        }

        //Validation errors
        if (res.status === 400 && Array.isArray(data)) {
          setError(data);
          return;
        }

        //Any other error
        setError(data.message || "Something went wrong. Please try again.");
        return;
      }

      setSuccess("Account created successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
      });

      // Optional: Redirect after success
      // setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="register-logo">Fablet</div>
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Start your writing journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="btn-register" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
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
          Already have an account?{" "}
          <a href="/login" className="register-link">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
