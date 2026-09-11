import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
    proxy: {
      // Forward NFC/QR redirect hits straight to the backend instead of
      // letting React Router's client-side fallback page swallow them.
      "/s": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      // Optional: lets you call the API from the frontend origin too,
      // matching how it'll behave in production behind a shared domain/proxy.
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});