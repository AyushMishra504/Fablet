import express from "express";
import cors from "cors";
import indexRouter from "./routes/index.mjs";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(`Error: ${err}`));

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from the frontend (set FRONTEND_URL env var in production)
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/", indexRouter);

app.get("/", (req, res) => {
  res.status(200).send("Fablet API is running");
});

app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = ["disconnected", "connected", "connecting", "disconnecting"][dbState] || "unknown";
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    db: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`),
);
