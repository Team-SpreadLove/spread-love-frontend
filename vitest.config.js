import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.js"],
    include: ["src/**/*.test.{js,jsx}"],
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
      include: [
        "src/shared/**/*.{js,jsx}",
        "src/sidepanel/**/*.{js,jsx}",
        "src/login/**/*.{js,jsx}",
        "src/settings/**/*.{js,jsx}",
      ],
      exclude: [
        "src/tests/**",
        "src/**/*.test.{js,jsx}",
        "src/sidepanel/main.jsx",
        "src/sidepanel/router.jsx",
        "src/login/main.jsx",
        "src/settings/main.jsx",
        "src/settings/router.jsx",
      ],
      thresholds: {
        lines: 70,
      },
    },
  },
});
