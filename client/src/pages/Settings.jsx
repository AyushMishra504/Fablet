import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import "../styles/settings.css";

const TABS = [
  { id: "profile", label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { id: "security", label: "Account & Security", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
  { id: "appearance", label: "Appearance", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
  { id: "writing", label: "Writing", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
  { id: "notifications", label: "Notifications", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
  { id: "danger", label: "Danger Zone", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", danger: true },
];

const LANGUAGE_OPTIONS = [
  "English", "Hindi", "Spanish", "French", "German", "Portuguese",
  "Japanese", "Korean", "Chinese", "Arabic", "Russian", "Other",
];

const FONT_OPTIONS = [
  { value: "Crimson Pro", label: "Crimson Pro" },
  { value: "Lora", label: "Lora" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Georgia", label: "Georgia" },
  { value: "Inter", label: "Inter" },
];

export default function Settings() {
  const { user, dark, setDark } = useOutletContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const avatarInputRef = useRef(null);

  // Profile state
  const [profile, setProfile] = useState({
    name: "", email: "", bio: "", penName: "", website: "", avatar: "",
  });

  // Preferences state
  const [prefs, setPrefs] = useState({
    defaultLanguage: "English",
    defaultVisibility: "private",
    autoSave: true,
    autoSaveInterval: 30,
    editorFont: "Crimson Pro",
    editorFontSize: 18,
    emailNotifs: true,
    weeklyDigest: false,
    aiSuggestions: true,
  });

  // Security state
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  // Danger state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Show toast helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiFetch("/api/settings", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        setProfile({
          name: data.name || "",
          email: data.email || "",
          bio: data.bio || "",
          penName: data.penName || "",
          website: data.website || "",
          avatar: data.avatar || "",
        });
        setPrefs({
          defaultLanguage: data.defaultLanguage || "English",
          defaultVisibility: data.defaultVisibility || "private",
          autoSave: data.autoSave !== undefined ? data.autoSave : true,
          autoSaveInterval: data.autoSaveInterval || 30,
          editorFont: data.editorFont || "Crimson Pro",
          editorFontSize: data.editorFontSize || 18,
          emailNotifs: data.emailNotifs !== undefined ? data.emailNotifs : true,
          weeklyDigest: data.weeklyDigest || false,
          aiSuggestions: data.aiSuggestions !== undefined ? data.aiSuggestions : true,
        });
      } catch (err) {
        showToast("error", "Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Save profile
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await apiFetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...profile, avatar: undefined }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Save failed");
      }
      showToast("success", "Profile saved successfully");
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  // Save preferences (writing / notifications)
  const handleSavePrefs = async () => {
    setSaving(true);
    try {
      const res = await apiFetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(prefs),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast("success", "Preferences saved successfully");
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      showToast("error", "Passwords do not match");
      return;
    }
    if (passwords.new.length < 6) {
      showToast("error", "Password must be at least 6 characters");
      return;
    }
    setSaving(true);
    try {
      const res = await apiFetch("/api/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");
      showToast("success", "Password changed successfully");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  // Upload avatar
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await apiFetch("/api/settings/avatar", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setProfile((p) => ({ ...p, avatar: data.avatar }));
        showToast("success", "Avatar updated");
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (err) {
      showToast("error", err.message);
    }
    e.target.value = "";
  };

  // Remove avatar
  const handleAvatarRemove = async () => {
    try {
      await apiFetch("/api/settings/avatar", {
        method: "DELETE",
        credentials: "include",
      });
      setProfile((p) => ({ ...p, avatar: "" }));
      showToast("success", "Avatar removed");
    } catch (err) {
      showToast("error", "Failed to remove avatar");
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await apiFetch("/api/settings/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ confirmation: deleteConfirm }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete account");
      }
      navigate("/");
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setDeleting(false);
    }
  };

  const TabIcon = ({ path }) => (
    <svg className="st-tab-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  );

  const Toggle = ({ on, onToggle }) => (
    <button
      className={`st-toggle ${on ? "st-toggle-on" : "st-toggle-off"}`}
      onClick={onToggle}
      type="button"
    >
      <span className={`st-toggle-thumb ${on ? "st-thumb-on" : ""}`} />
    </button>
  );

  if (loading) {
    return (
      <div className="settings-root" style={{ alignItems: "center", justifyContent: "center" }}>
        <div className="db-spinner" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      // ═══════════════════════ PROFILE ═══════════════════════
      case "profile":
        return (
          <>
            <h2 className="st-section-heading">Profile</h2>

            <div className="st-card">
              <h3 className="st-card-title">Your Avatar</h3>
              <p className="st-card-desc">This is your public profile picture. Click to upload a new one.</p>

              <div className="st-avatar-section">
                <div className="st-avatar-circle">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="st-avatar-img" />
                  ) : (
                    (profile.name?.[0] || profile.email?.[0] || "U").toUpperCase()
                  )}
                </div>
                <div className="st-avatar-actions">
                  <div className="st-avatar-btns">
                    <button className="st-avatar-upload-btn" onClick={() => avatarInputRef.current?.click()}>
                      Upload Photo
                    </button>
                    {profile.avatar && (
                      <button className="st-avatar-remove-btn" onClick={handleAvatarRemove}>
                        Remove
                      </button>
                    )}
                  </div>
                  <p>JPG, PNG up to 5MB</p>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </div>

            <div className="st-card">
              <h3 className="st-card-title">Personal Information</h3>
              <p className="st-card-desc">Update your name, bio, and contact information.</p>

              <div className="st-field-row">
                <div className="st-field">
                  <label className="st-label">Display Name</label>
                  <input
                    className="st-input"
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your name"
                  />
                </div>
                <div className="st-field">
                  <label className="st-label">Pen Name <span className="st-label-hint">(optional)</span></label>
                  <input
                    className="st-input"
                    value={profile.penName}
                    onChange={(e) => setProfile((p) => ({ ...p, penName: e.target.value }))}
                    placeholder="Pseudonym for published stories"
                  />
                </div>
              </div>

              <div className="st-field">
                <label className="st-label">Bio <span className="st-label-hint">({profile.bio.length}/300)</span></label>
                <textarea
                  className="st-textarea"
                  value={profile.bio}
                  onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value.slice(0, 300) }))}
                  placeholder="Tell readers about yourself..."
                  maxLength={300}
                />
              </div>

              <div className="st-field-row">
                <div className="st-field">
                  <label className="st-label">Email</label>
                  <input
                    className="st-input"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div className="st-field">
                  <label className="st-label">Website <span className="st-label-hint">(optional)</span></label>
                  <input
                    className="st-input"
                    value={profile.website}
                    onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))}
                    placeholder="https://yoursite.com"
                  />
                </div>
              </div>

              <div className="st-save-bar">
                <button className="st-save-btn" onClick={handleSaveProfile} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </>
        );

      // ═══════════════════════ SECURITY ═══════════════════════
      case "security":
        return (
          <>
            <h2 className="st-section-heading">Account & Security</h2>

            <div className="st-card">
              <h3 className="st-card-title">Change Password</h3>
              <p className="st-card-desc">Update your password to keep your account secure.</p>

              <div className="st-field">
                <label className="st-label">Current Password</label>
                <div className="st-password-wrap">
                  <input
                    className="st-input"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwords.current}
                    onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                    placeholder="Enter current password"
                  />
                  <button
                    className="st-password-toggle"
                    onClick={() => setShowPasswords((p) => ({ ...p, current: !p.current }))}
                    type="button"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPasswords.current
                        ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      } />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="st-field-row">
                <div className="st-field">
                  <label className="st-label">New Password</label>
                  <div className="st-password-wrap">
                    <input
                      className="st-input"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwords.new}
                      onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
                      placeholder="At least 6 characters"
                    />
                    <button
                      className="st-password-toggle"
                      onClick={() => setShowPasswords((p) => ({ ...p, new: !p.new }))}
                      type="button"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPasswords.new
                          ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        } />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="st-field">
                  <label className="st-label">Confirm New Password</label>
                  <div className="st-password-wrap">
                    <input
                      className="st-input"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                      placeholder="Re-enter new password"
                    />
                    <button
                      className="st-password-toggle"
                      onClick={() => setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))}
                      type="button"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPasswords.confirm
                          ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        } />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {passwords.new && passwords.confirm && passwords.new !== passwords.confirm && (
                <p style={{ color: "#ef4444", fontSize: "0.8125rem", margin: "0 0 0.5rem" }}>Passwords do not match</p>
              )}

              <div className="st-save-bar">
                <button
                  className="st-save-btn"
                  onClick={handleChangePassword}
                  disabled={saving || !passwords.current || !passwords.new || !passwords.confirm}
                >
                  {saving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>

            <div className="st-card">
              <h3 className="st-card-title">Session Info</h3>
              <p className="st-card-desc">Your active session details.</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", background: "var(--input-bg)", borderRadius: "0.5rem", border: "1px solid var(--border)" }}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 20, height: 20, color: "var(--accent-text)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 500, color: "var(--text)" }}>Current session active</p>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>Logged in via JWT • Expires in 7 days</p>
                </div>
              </div>
            </div>
          </>
        );

      // ═══════════════════════ APPEARANCE ═══════════════════════
      case "appearance":
        return (
          <>
            <h2 className="st-section-heading">Appearance</h2>

            <div className="st-card">
              <h3 className="st-card-title">Theme</h3>
              <p className="st-card-desc">Choose how Fablet looks to you.</p>

              <div className="st-toggle-row" style={{ borderBottom: "none" }}>
                <div className="st-toggle-info">
                  <p className="st-toggle-label">Dark Mode</p>
                  <p className="st-toggle-desc">Switch between light and dark themes across the entire application.</p>
                </div>
                <Toggle on={dark} onToggle={() => setDark((prev) => !prev)} />
              </div>
            </div>

            <div className="st-card">
              <h3 className="st-card-title">Editor Preferences</h3>
              <p className="st-card-desc">Customize the writing experience in the editor.</p>

              <div className="st-field">
                <label className="st-label">Editor Font</label>
                <select
                  className="st-select"
                  value={prefs.editorFont}
                  onChange={(e) => setPrefs((p) => ({ ...p, editorFont: e.target.value }))}
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>

              <div className="st-field">
                <label className="st-label">Font Size — {prefs.editorFontSize}px</label>
                <div className="st-range-group">
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>14</span>
                  <input
                    type="range"
                    className="st-range"
                    min={14}
                    max={28}
                    value={prefs.editorFontSize}
                    onChange={(e) => setPrefs((p) => ({ ...p, editorFontSize: Number(e.target.value) }))}
                  />
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>28</span>
                </div>
              </div>

              <div className="st-font-preview" style={{ fontFamily: prefs.editorFont + ", serif", fontSize: prefs.editorFontSize + "px" }}>
                The moonlight spilled through the conservatory windows, casting silver lattice patterns across the stone floor. Elias paused, his breath catching in the sudden stillness.
              </div>

              <div className="st-save-bar">
                <button className="st-save-btn" onClick={handleSavePrefs} disabled={saving}>
                  {saving ? "Saving..." : "Save Preferences"}
                </button>
              </div>
            </div>
          </>
        );

      // ═══════════════════════ WRITING ═══════════════════════
      case "writing":
        return (
          <>
            <h2 className="st-section-heading">Writing Preferences</h2>

            <div className="st-card">
              <h3 className="st-card-title">Auto-Save</h3>
              <p className="st-card-desc">Automatically save your work while writing in the editor.</p>

              <div className="st-toggle-row">
                <div className="st-toggle-info">
                  <p className="st-toggle-label">Enable Auto-Save</p>
                  <p className="st-toggle-desc">Your story will be saved periodically while you write.</p>
                </div>
                <Toggle on={prefs.autoSave} onToggle={() => setPrefs((p) => ({ ...p, autoSave: !p.autoSave }))} />
              </div>

              {prefs.autoSave && (
                <div className="st-field" style={{ marginTop: "1rem" }}>
                  <label className="st-label">Save Interval</label>
                  <select
                    className="st-select"
                    value={prefs.autoSaveInterval}
                    onChange={(e) => setPrefs((p) => ({ ...p, autoSaveInterval: Number(e.target.value) }))}
                  >
                    <option value={15}>Every 15 seconds</option>
                    <option value={30}>Every 30 seconds</option>
                    <option value={60}>Every 1 minute</option>
                    <option value={120}>Every 2 minutes</option>
                  </select>
                </div>
              )}
            </div>

            <div className="st-card">
              <h3 className="st-card-title">Defaults for New Stories</h3>
              <p className="st-card-desc">Set defaults that apply when you create a new story.</p>

              <div className="st-field">
                <label className="st-label">Default Language</label>
                <select
                  className="st-select"
                  value={prefs.defaultLanguage}
                  onChange={(e) => setPrefs((p) => ({ ...p, defaultLanguage: e.target.value }))}
                >
                  {LANGUAGE_OPTIONS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="st-field">
                <label className="st-label">Default Visibility</label>
                <div className="st-radio-group">
                  {[
                    { value: "private", label: "Private", sub: "Only you can see" },
                    { value: "public", label: "Public", sub: "Visible on Explore" },
                  ].map((opt) => (
                    <div
                      key={opt.value}
                      className={`st-radio-option ${prefs.defaultVisibility === opt.value ? "st-radio-option-active" : ""}`}
                      onClick={() => setPrefs((p) => ({ ...p, defaultVisibility: opt.value }))}
                    >
                      <div className="st-radio-dot">
                        <div className="st-radio-dot-inner" />
                      </div>
                      <div>
                        <div className="st-radio-text">{opt.label}</div>
                        <div className="st-radio-sub">{opt.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="st-card">
              <h3 className="st-card-title">AI Writing Assistant</h3>
              <p className="st-card-desc">Control how Ink AI interacts with your writing.</p>

              <div className="st-toggle-row" style={{ borderBottom: "none" }}>
                <div className="st-toggle-info">
                  <p className="st-toggle-label">Ink Auto-Suggestions</p>
                  <p className="st-toggle-desc">Receive real-time AI suggestions while you write in the editor.</p>
                </div>
                <Toggle on={prefs.aiSuggestions} onToggle={() => setPrefs((p) => ({ ...p, aiSuggestions: !p.aiSuggestions }))} />
              </div>
            </div>

            <div className="st-save-bar" style={{ border: "none", paddingTop: 0 }}>
              <button className="st-save-btn" onClick={handleSavePrefs} disabled={saving}>
                {saving ? "Saving..." : "Save Writing Preferences"}
              </button>
            </div>
          </>
        );

      // ═══════════════════════ NOTIFICATIONS ═══════════════════════
      case "notifications":
        return (
          <>
            <h2 className="st-section-heading">Notifications</h2>

            <div className="st-card">
              <h3 className="st-card-title">Email Notifications</h3>
              <p className="st-card-desc">Manage what emails you receive from Fablet.</p>

              <div className="st-toggle-row">
                <div className="st-toggle-info">
                  <p className="st-toggle-label">Story Interactions</p>
                  <p className="st-toggle-desc">Get notified when readers interact with your published stories.</p>
                </div>
                <Toggle on={prefs.emailNotifs} onToggle={() => setPrefs((p) => ({ ...p, emailNotifs: !p.emailNotifs }))} />
              </div>

              <div className="st-toggle-row">
                <div className="st-toggle-info">
                  <p className="st-toggle-label">Weekly Digest</p>
                  <p className="st-toggle-desc">A weekly summary of your writing activity and story performance.</p>
                </div>
                <Toggle on={prefs.weeklyDigest} onToggle={() => setPrefs((p) => ({ ...p, weeklyDigest: !p.weeklyDigest }))} />
              </div>

              <div className="st-toggle-row">
                <div className="st-toggle-info">
                  <p className="st-toggle-label">AI Writing Tips</p>
                  <p className="st-toggle-desc">Receive periodic writing tips and suggestions powered by Ink AI.</p>
                </div>
                <Toggle on={prefs.aiSuggestions} onToggle={() => setPrefs((p) => ({ ...p, aiSuggestions: !p.aiSuggestions }))} />
              </div>
            </div>

            <div className="st-save-bar" style={{ border: "none", paddingTop: 0 }}>
              <button className="st-save-btn" onClick={handleSavePrefs} disabled={saving}>
                {saving ? "Saving..." : "Save Notification Settings"}
              </button>
            </div>
          </>
        );

      // ═══════════════════════ DANGER ZONE ═══════════════════════
      case "danger":
        return (
          <>
            <h2 className="st-section-heading">Danger Zone</h2>

            <div className="st-danger-card">
              <h3 className="st-danger-title">Delete Account</h3>
              <p className="st-danger-desc">
                Permanently delete your account and all associated data, including all stories, drafts, and settings.
                This action is <strong>irreversible</strong>.
              </p>
              <button className="st-danger-btn" onClick={() => setShowDeleteModal(true)}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 16, height: 16 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete My Account
              </button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <main className="settings-root">
      {/* Tab Sidebar */}
      <nav className="st-tabs">
        <h2 className="st-tab-heading">Settings</h2>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`st-tab ${activeTab === tab.id ? "st-tab-active" : ""} ${tab.danger ? "st-tab-danger" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <TabIcon path={tab.icon} />
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="st-content">
        {renderContent()}
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="st-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="st-modal" onClick={(e) => e.stopPropagation()}>
            <div className="st-modal-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 28, height: 28 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3>Delete Account</h3>
            <p>
              This will permanently delete your account and <strong>all {user?.name || "your"}'s stories</strong>. Type <strong>DELETE</strong> below to confirm.
            </p>
            <input
              className="st-modal-input"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE"
              autoFocus
            />
            <div className="st-modal-actions">
              <button className="st-modal-cancel" onClick={() => { setShowDeleteModal(false); setDeleteConfirm(""); }}>
                Cancel
              </button>
              <button
                className="st-modal-delete"
                disabled={deleteConfirm !== "DELETE" || deleting}
                onClick={handleDeleteAccount}
              >
                {deleting ? "Deleting..." : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`st-toast ${toast.type === "success" ? "st-toast-success" : "st-toast-error"}`}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
              toast.type === "success"
                ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            } />
          </svg>
          {toast.message}
        </div>
      )}
    </main>
  );
}
