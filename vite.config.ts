import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  plugins: [
    tanstackStart(),
    tailwindcss(),
    react(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
  ],
  server: {
    allowedHosts: true,
  },
});
