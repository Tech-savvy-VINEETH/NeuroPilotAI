import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    'process': JSON.stringify({ 
      env: {},
      stdout: { isTTY: false },
      stderr: { isTTY: false }
    }),
    'global': 'window',
  },
});