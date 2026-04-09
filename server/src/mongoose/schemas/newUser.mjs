import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: true,
    minLength: [6, "Password must be at least 6 characters long"],
  },
  email: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },

  // Profile
  avatar: { type: String, default: "" },
  bio: { type: String, default: "", maxlength: 300 },
  penName: { type: String, default: "" },
  website: { type: String, default: "" },

  // Writing Preferences
  defaultLanguage: { type: String, default: "English" },
  defaultVisibility: { type: String, enum: ["private", "public"], default: "private" },
  autoSave: { type: Boolean, default: true },
  autoSaveInterval: { type: Number, default: 30 },
  editorFont: { type: String, default: "Crimson Pro" },
  editorFontSize: { type: Number, default: 18 },

  // Notifications
  emailNotifs: { type: Boolean, default: true },
  weeklyDigest: { type: Boolean, default: false },
  aiSuggestions: { type: Boolean, default: true },
});

const newUser = mongoose.model("newUser", UserSchema);
export default newUser;
