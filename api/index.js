import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js"

const app = express();
app.use(cors());
app.use(express.json());

// --- Debug logger ---
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`, req.body);
  next();
});

// --- Routes utama ---
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "✅ API berjalan 🚀" });
});

// --- Catch-all untuk route yang tidak ada ---
app.use((req, res) => {
  res.status(404).json({ error: "Route tidak ditemukan", path: req.originalUrl });
});

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error", detail: err.message });
});

// ✅ Untuk lokal dev
if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => console.log("Server running at http://localhost:3000"));
}

// ✅ Untuk Vercel
export default app;
