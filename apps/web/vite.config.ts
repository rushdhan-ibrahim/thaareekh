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
      // CDN-loaded libraries stay external; resolved by importmap at runtime
      external: ['d3', '@floating-ui/dom', 'gsap'],
      output: {
        // Stable filenames for static deployment (no content hashes)
        entryFileNames: 'assets/main.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
});
