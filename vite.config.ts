import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Explicit development-preview hostname; do not allow arbitrary hosts.
  server: { allowedHosts: ["terminal.local"] },
});
