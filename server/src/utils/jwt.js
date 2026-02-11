import jwt from "jsonwebtoken";

export const JWT_SECRET = "U--lb%e9HnPofkK6me^dKaL:v#M[K(D^zKYQs2$Z>%S";
const JWT_EXPIRES_IN = "7d";

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};
