import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ["crypto", "buffer", "stream", "util"],
      globals: { Buffer: true, global: true, process: true },
    }),
  ],
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      buffer: "buffer",
    },
  },
  optimizeDeps: {
    include: ["buffer", "@pq-jwt/core", "@pq-jwt/hybrid", "@pq-jose/jose"],
  },
  build: {
    target: "es2022",
  },
  server: {
    watch: {
      // Avoid EMFILE on environments with low fs watcher limits
      usePolling: true,
      interval: 1000,
    },
  },
});
