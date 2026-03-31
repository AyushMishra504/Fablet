import { Router } from "express";
import User from "../mongoose/schemas/newUser.mjs";
import auth from "../middleware/auth.mjs";

const router = Router();

router.get("/api/dashboard", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;