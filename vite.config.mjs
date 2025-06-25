import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Explicit ESM imports
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  build: {
    outDir: "build",
  },
  plugins: [react()],
  server: {
    port: 8301,
    allowedHosts: [".apps-tunnel.monday.app", ".ngrok-free.app"],
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
});
