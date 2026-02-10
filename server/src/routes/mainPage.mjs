import { Router } from "express";
import tokenVerification from "./auth/tokenVerification.mjs";

const router = Router();
router.use(tokenVerification);

router.get("/api/dashboard", (req, res) => {
  res.json({ message: "Welcome to dashboard", userId: req.user.userId });
});

export default router;
