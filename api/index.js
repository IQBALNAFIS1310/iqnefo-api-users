import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const PORT = 25586;

// Middleware
app.use(cors());
app.use(express.json());


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

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "Halo 👋, ini adalah bagian dari project React saya.\nAPI ini digunakan untuk mengelola data user dengan fitur register, login, dan proteksi menggunakan API Key.\nJika kamu melihat pesan ini berarti Kamu telah mengakses API Saya!",
    endpoints: {
      "POST /register": "Register user baru",
      "POST /login": "Login user, mengembalikan API Key",
      "GET /users?apikey=your_api_key": "Ambil semua user (wajib API Key)",
      "GET /movie?apikey=your_api_key": "Untuk Mengambil Data Movie (wajib API Key)"
    }
  });
});

// GET all users (protected)
app.get("/users",(req, res) => {
  const filePath = path.join(process.cwd(), "data", "users.json");
  const data = JSON.parse(fs.readFileSync(filePath));
  res.json(data);
});

// POST login (return user info + apiKey jika perlu)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const filePath = path.join(process.cwd(), "data", "users.json");
  const data = JSON.parse(fs.readFileSync(filePath));
  const users = data.users;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Login Gagal" });
  }

  // Ambil hanya field yang diperlukan
  const { id, name, username: uname, email } = user;

  res.json({
    message: "Login successful",
    user: { id, name, username: uname, email }
  });
});


// POST register
app.post("/register", (req, res) => {
  const newUser = req.body;

  const error = validateUser(newUser);
  if (error) {
    return res.status(400).json({ error });
  }

  const filePath = path.join(process.cwd(), "data", "users.json");
  const data = JSON.parse(fs.readFileSync(filePath)); // Ambil objek JSON
  const users = data.users; // Ambil array users dari objek JSON

  if (users.find((u) => u.username === newUser.username)) {
    return res.status(409).json({ error: "Gunakan Username Lain:)" });
  }

  users.push(newUser); // Tambahkan user baru
  fs.writeFileSync(filePath, JSON.stringify({ users }, null, 2)); // Simpan ulang sebagai objek

  res.status(201).json({ message: "Registrasi Berhasil:V" });
});


// GET user by ID (protected)
app.get("/users/:id",  (req, res) => {
  const filePath = path.join(process.cwd(), "data", "users.json");
  const data = JSON.parse(fs.readFileSync(filePath));
  const users = data.users;

  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: "User tidak ditemukan" });
  }

  res.json(user);
});

// PUT update user (protected)
app.put("/users/:id",  (req, res) => {
  const { id } = req.params;
  const filePath = path.join(process.cwd(), "data", "users.json");
  const data = JSON.parse(fs.readFileSync(filePath));
  const users = data.users;

  const index = users.findIndex((u) => u.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ error: "User tidak ditemukan" });
  }

  // update field yang ada (kecuali password kalau tidak dikirim)
  users[index] = { ...users[index], ...req.body };

  fs.writeFileSync(filePath, JSON.stringify({ users }, null, 2));
  res.json({ message: "User berhasil diperbarui", user: users[index] });
});

// DELETE user (protected)
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const filePath = path.join(process.cwd(), "data", "users.json");
  const data = JSON.parse(fs.readFileSync(filePath));
  const users = data.users;

  const index = users.findIndex((u) => u.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ error: "User tidak ditemukan" });
  }

  const deletedUser = users.splice(index, 1)[0];
  fs.writeFileSync(filePath, JSON.stringify({ users }, null, 2));

  res.json({ message: "User berhasil dihapus", user: deletedUser });
});

// MOVIE LIST

app.get("/movie", (req, res) => {
  const filePath = path.join(process.cwd(), "data", "movie.json");
  const data = JSON.parse(fs.readFileSync(filePath));
  res.json(data);
});

// Start server (local)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
}

export default app;
