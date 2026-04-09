import { Router } from "express";
import User from "../mongoose/schemas/newUser.mjs";
import Story from "../mongoose/schemas/story.mjs";
import auth from "../middleware/auth.mjs";
import { hashPassword, comparePassword } from "../utils/passwordHashing.mjs";
import { upload, uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.mjs";

const router = Router();

// ── GET /api/settings — Fetch user profile & preferences ──
router.get("/api/settings", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/settings/profile — Update profile & preferences ──
router.put("/api/settings/profile", auth, async (req, res) => {
  try {
    const allowedFields = [
      "name", "bio", "penName", "website", "email",
      "defaultLanguage", "defaultVisibility",
      "autoSave", "autoSaveInterval",
      "editorFont", "editorFontSize",
      "emailNotifs", "weeklyDigest", "aiSuggestions",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // If email is being changed, check it's not taken
    if (updates.email) {
      const existing = await User.findOne({ email: updates.email, _id: { $ne: req.user.id } });
      if (existing) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/settings/password — Change password ──
router.put("/api/settings/password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = hashPassword(newPassword);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/settings/avatar — Upload avatar ──
router.put("/api/settings/avatar", auth, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete old avatar from Cloudinary if it exists
    if (user.avatar) {
      const parts = user.avatar.split("/");
      const publicId = parts.slice(-2).join("/").split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    const result = await uploadToCloudinary(req.file.buffer, "fablet-avatars");
    user.avatar = result.secure_url;
    await user.save();

    res.json({ avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/settings/avatar — Remove avatar ──
router.delete("/api/settings/avatar", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.avatar) {
      const parts = user.avatar.split("/");
      const publicId = parts.slice(-2).join("/").split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    user.avatar = "";
    await user.save();
    res.json({ message: "Avatar removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/settings/account — Delete user account & all stories ──
router.delete("/api/settings/account", auth, async (req, res) => {
  try {
    const { confirmation } = req.body;
    if (confirmation !== "DELETE") {
      return res.status(400).json({ message: "Please type DELETE to confirm" });
    }

    // Delete all user's stories
    await Story.deleteMany({ userId: req.user.id });

    // Delete user
    await User.findByIdAndDelete(req.user.id);

    // Clear auth cookie
    res.clearCookie("token");
    res.json({ message: "Account deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
