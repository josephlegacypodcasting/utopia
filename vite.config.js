import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    // Keep the carrier logos as real files instead of letting Vite inline
    // small assets as base64 — the single-file GHL build re-inlines them.
    assetsInlineLimit: 0,
  },
});
