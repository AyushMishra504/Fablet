import { Router } from "express";
import Story from "../mongoose/schemas/story.mjs";
import auth from "../middleware/auth.mjs";
import { upload, uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.mjs";

const router = Router();

// ✅ Create new story
router.post("/api/stories", auth, async (req, res) => {
  try {
    const story = await Story.create({
      userId: req.user.id,
    });

    res.status(201).json(story);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get all stories (dashboard)
router.get("/api/stories", auth, async (req, res) => {
  const stories = await Story.find({ userId: req.user.id })
    .sort({ updatedAt: -1 });

  res.json(stories);
});

// ✅ Get single story (editor)
router.get("/api/stories/:id", auth, async (req, res) => {
  const story = await Story.findById(req.params.id);
  res.json(story);
});

// ✅ Update story (content + settings)
router.put("/api/stories/:id", auth, async (req, res) => {
  const {
    title, content,
    description, genre, tags, language,
    contentRating, penName, visibility, status,
  } = req.body;

  const updateFields = {};

  // Content fields
  if (title !== undefined) updateFields.title = title;
  if (content !== undefined) {
    updateFields.content = content;
    const plainText = (content || "").replace(/<[^>]*>/g, " ");
    updateFields.wordCount =
      plainText.trim() === "" ? 0 : plainText.trim().split(/\s+/).length;
  }

  // Settings fields
  if (description !== undefined) updateFields.description = description;
  if (genre !== undefined) updateFields.genre = genre;
  if (tags !== undefined) updateFields.tags = tags;
  if (language !== undefined) updateFields.language = language;
  if (contentRating !== undefined) updateFields.contentRating = contentRating;
  if (penName !== undefined) updateFields.penName = penName;
  if (visibility !== undefined) updateFields.visibility = visibility;
  if (status !== undefined) updateFields.status = status;

  const story = await Story.findByIdAndUpdate(
    req.params.id,
    updateFields,
    { new: true }
  );

  res.json(story);
});

// ✅ Upload cover image
router.post("/api/stories/:id/cover", auth, upload.single("cover"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Find existing story to check for old cover
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    // Delete old cover from Cloudinary if exists
    if (story.coverImagePublicId) {
      await deleteFromCloudinary(story.coverImagePublicId);
    }

    // Upload new cover to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    // Update story with new cover URL
    story.coverImage = result.secure_url;
    story.coverImagePublicId = result.public_id;
    await story.save();

    res.json({
      coverImage: result.secure_url,
      coverImagePublicId: result.public_id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete cover image
router.delete("/api/stories/:id/cover", auth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    if (story.coverImagePublicId) {
      await deleteFromCloudinary(story.coverImagePublicId);
    }

    story.coverImage = "";
    story.coverImagePublicId = "";
    await story.save();

    res.json({ message: "Cover removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete story
router.delete("/api/stories/:id", auth, async (req, res) => {
  try {
    const story = await Story.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Clean up cover image from Cloudinary
    if (story.coverImagePublicId) {
      await deleteFromCloudinary(story.coverImagePublicId);
    }

    res.json({ message: "Story deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;