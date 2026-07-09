import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 0, // never inline assets as base64
  },
  assetsInclude: ["**/*.jpg", "**/*.png", "**/*.jpeg"],
});
