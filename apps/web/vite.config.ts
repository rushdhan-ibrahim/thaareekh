import { defineConfig } from 'vite';

export default defineConfig({
  // Relative paths so dist/ can be served from any directory
  base: './',
  server: {
    host: '127.0.0.1',
    port: 5173,
    fs: {
      // Allow serving files from project root (CSS, data modules)
      allow: ['../..']
    }
  },
  build: {
    rollupOptions: {
      // Libraries bundle and tree-shake; the importmap remains only for
      // the legacy no-build runtime at the repo root.
      output: {
        // Stable filenames for static deployment (no content hashes)
        entryFileNames: 'assets/main.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
});
