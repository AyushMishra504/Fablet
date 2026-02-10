import express from "express";
import indexRouter from "./routes/index.mjs";
import mongoose from "mongoose";

mongoose
  .connect("mongodb://localhost/fable")
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(`Error: ${err}`));

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(indexRouter);

app.get("/", (req, res) => {
  res.status(200).send("Landing Page");
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`),
);
