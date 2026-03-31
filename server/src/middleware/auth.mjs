import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/jwt.js";

export default function (req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}