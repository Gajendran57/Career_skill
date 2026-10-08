// frontend/src/api.js
import axios from "axios";

// Vite exposes env vars prefixed with VITE_ at build time.
// Set VITE_API_URL in .env.local (dev) and in Vercel env vars (prod).
export const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000, // 60s — gives Render free tier time to cold-start
});

export default api;