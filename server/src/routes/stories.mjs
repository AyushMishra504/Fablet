import { Router } from "express";
import Story from "../mongoose/schemas/story.mjs";
import auth from "../middleware/auth.mjs";

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

export default router;