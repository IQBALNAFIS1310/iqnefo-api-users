import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- SECURITY: API KEY via query string ---
const API_KEY = process.env.API_KEY || "secret123";

function checkApiKey(req, res, next) {
  const token = req.query.apikey; // ambil dari URL
  if (!token) {
    return res.status(401).json({ error: "No API key provided" });
  }
  if (token !== API_KEY) {
    return res.status(403).json({ error: "Invalid API key" });
  }
  next();
}

// --- VALIDASI HELPER ---
function validateUser(user) {
  if (!user.username || typeof user.username !== "string") {
    return "Username is required and must be a string";
  }
  if (!user.password || user.password.length < 4) {
    return "Password is required and must be at least 4 characters";
  }
  return null;
}

// --- ROUTES ---

// GET all users (protected)
app.get("/users", checkApiKey, (req, res) => {
  const filePath = path.join(process.cwd(), "data", "users.json");
  const data = JSON.parse(fs.readFileSync(filePath));
  res.json(data);
});

// POST login (return API key)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const filePath = path.join(process.cwd(), "data", "users.json");
  const users = JSON.parse(fs.readFileSync(filePath));

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({ message: "Login successful", apiKey: API_KEY });
});

// POST register
app.post("/register", (req, res) => {
  const newUser = req.body;

  const error = validateUser(newUser);
  if (error) {
    return res.status(400).json({ error });
  }

  const filePath = path.join(process.cwd(), "data", "users.json");
  const users = JSON.parse(fs.readFileSync(filePath));

  if (users.find((u) => u.username === newUser.username)) {
    return res.status(409).json({ error: "Username already exists" });
  }

  users.push(newUser);
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  res.status(201).json({ message: "User registered successfully" });
});

// Start server (local)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
}

export default app;
