import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Landing Page");
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`),
);
