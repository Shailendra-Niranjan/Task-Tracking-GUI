import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import global from 'global';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // Polyfill `global` for the browser using the correct method
      global: 'global/window' // Use the browser version of the global polyfill
    }
  },
  define: {
    'global': 'window'  // Ensure `global` is available in the browser environment
  },
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://task-racker.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
