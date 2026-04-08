import { Router } from "express";
import Story from "../mongoose/schemas/story.mjs";
import auth from "../middleware/auth.mjs";
import User from "../mongoose/schemas/newUser.mjs";

const router = Router();

// ✅ Create new story
router.post("/api/stories", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const story = await Story.create({
      userId: req.user.id,
      name: user ? user.name : "Anonymous",
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

// ✅ Update story (auto-save)
router.put("/api/stories/:id", auth, async (req, res) => {
  const { title, content } = req.body;

  const wordCount =
    !content || content.trim() === "" ? 0 : content.trim().split(/\s+/).length;

  const story = await Story.findByIdAndUpdate(
    req.params.id,
    { title, content, wordCount },
    { new: true }
  );

  res.json(story);
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

    res.json({ message: "Story deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get stories for explore page
router.get("/api/explore", auth, async (req, res) => {
  const stories = await Story.find({ status: "published" });
  res.json(stories);
});

// ✅ Publish story
router.put("/api/stories/:id/publish", auth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Optional: ensure only owner can publish
    if (story.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    story.status = "published";
    story.updatedAt = new Date();

    if (req.body.title !== undefined) story.title = req.body.title;
    if (req.body.content !== undefined) {
      story.content = req.body.content;
      story.wordCount = !req.body.content || req.body.content.trim() === "" ? 0 : req.body.content.trim().split(/\s+/).length;
    }

    await story.save();

    res.json({ message: "Story published", story });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;