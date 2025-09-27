import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(express.json());

// --- Supabase Config ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Routes ---
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .limit(1);

  if (error) return res.status(500).json({ error: error.message });
  if (!users || users.length === 0)
    return res.status(404).json({ error: "User tidak ditemukan" });

  const user = users[0];

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Password salah" });

  res.json({
    message: "Login sukses",
    user: { id: user.id, username: user.username, email: user.email, name: user.name }
  });
});

// ✅ Export untuk Vercel (bukan app.listen)
export default app;
