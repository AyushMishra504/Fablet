import { Router } from "express";
import { tokenVerification } from "./auth/tokenVerification.mjs";
import User from "../mongoose/schemas/newUser.mjs";

const router = Router();
router.use(tokenVerification);

router.get("/api/dashboard", async (req, res) => {
  const userId = req.user.userId;
  const currentUser = await User.findById(userId);
  res.json({ user: currentUser });
});

export default router;
