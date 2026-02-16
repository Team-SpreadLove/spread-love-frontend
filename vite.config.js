import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import manifest from "./manifest.json";

export default defineConfig({
  plugins: [react(), tailwindcss(), crx({ manifest })],
  build: {
    rollupOptions: {
      input: {
        login: "src/login/index.html",
      },
    },
  },
  server: {
    port: 5173,
    hmr: {
      port: 5173,
    },
    cors: {
      origin: true,
      credentials: true,
    },
  },
});
