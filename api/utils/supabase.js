import { createClient } from "@supabase/supabase-js";

// ⚠️ Gunakan env (lebih aman). Kalau mau cepat test bisa hardcode dulu.
const supabaseUrl = process.env.SUPABASE_URL || "https://qfdhgmoovyzkkqegxhew.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmZGhnbW9vdnl6a2txZWd4aGV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODE4MDQsImV4cCI6MjA3NDU1NzgwNH0.YX_x5qkTG_WSQFfVTFKM7faYCGxcSsZkuP3_MdYHMCs";

export const supabase = createClient(supabaseUrl, supabaseKey);
