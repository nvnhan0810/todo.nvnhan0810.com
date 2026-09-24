import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    laravel({
      input: ["resources/sass/app.scss", "resources/ts/app.tsx"],
      ssr: "resources/ts/ssr.tsx",
      refresh: true,
    }),
    react(),
  ],
  ssr: {
    // Bundle all deps into bootstrap/ssr/ssr.js — no node_modules needed at runtime.
    noExternal: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "resources"),
      "@ts": path.resolve(__dirname, "resources/ts"),
    },
  },
  server: {
    watch: {
      ignored: ["**/storage/framework/views/**"],
    },
  },
});
