import { Router } from "express";

const router = Router();

router.post("/api/logout", (req, res) => {
  // Clear the token cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
