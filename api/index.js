import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// GET all users
app.get("/users", (req, res) => {
  const dataPath = path.join(__dirname, "../data/users.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  res.json(data);
});

// POST login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const dataPath = path.join(__dirname, "../data/users.json");
  const users = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  const found = users.find(
    (u) => u.username === username && u.password === password
  );

  if (found) {
    res.json({ success: true, user: found });
  } else {
    res.status(401).json({ success: false, message: "Login gagal" });
  }
});

// Lokal (dev)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running http://localhost:${PORT}`));
}

export default app;
