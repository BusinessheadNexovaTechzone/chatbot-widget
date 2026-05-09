import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "production"
    ),
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/widget-entry.jsx"),
      name: "ChatBot",
      fileName: () => "chatbot.iife.js", // ✅ fixed name
      formats: ["iife"],
    },
    cssCodeSplit: false, // 🔥 MOST IMPORTANT FIX
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/ws": {
        target: "ws://localhost:8000",
        ws: true,
        changeOrigin: true,
      },
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});