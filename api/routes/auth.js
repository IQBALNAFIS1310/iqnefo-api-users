import express from "express";
import bcrypt from "bcrypt";
import { supabase } from "../utils/supabase.js";

const router = express.Router();

// --- REGISTER ---
router.post("/register", async (req, res) => {
  const { username, email, password, name } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email, dan password wajib diisi" });
  }

  // cek apakah username sudah ada
  const { data: existing, error: checkError } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .single();

  if (existing) return res.status(409).json({ error: "Username sudah dipakai" });
  if (checkError && checkError.code !== "PGRST116") return res.status(500).json({ error: checkError.message });

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // simpan user ke supabase
  const { data, error } = await supabase
    .from("users")
    .insert([{ username, email, name, password: hashedPassword }])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({
    message: "Registrasi berhasil",
    user: { id: data[0].id, username: data[0].username, email: data[0].email, name: data[0].name },
  });
});

// --- LOGIN ---
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username dan password wajib diisi" });
  }

  // cari user di Supabase
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .limit(1);

  if (error) return res.status(500).json({ error: error.message });
  if (!users || users.length === 0) return res.status(404).json({ error: "User tidak ditemukan" });

  const user = users[0];

  // cek password
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Password salah" });

  res.json({
    message: "Login sukses",
    user: { id: user.id, username: user.username, email: user.email, name: user.name },
  });
});

export default router;
