import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Route-level code splitting is handled by React.lazy in src/App.jsx.
    // Keep vendor chunks separate so app code changes rarely invalidate vendor.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-router')) return 'router';
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) {
            return 'react';
          }
          if (id.includes('node_modules/zod') || id.includes('node_modules/@hookform')) {
            return 'forms';
          }
          return undefined;
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    css: false,
    // 'forks' pulls in undici, which crashes on Node 22.14 in this setup.
    pool: 'threads',
  },
})