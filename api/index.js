import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use("/auth", authRoutes);

// ✅ Untuk lokal dev
if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => console.log("Server running at http://localhost:3000"));
}

// ✅ Untuk Vercel
export default app;
  