import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

console.log('VITE_API_BASE_URL:', process.env.VITE_API_BASE_URL);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  base: '/personalportalen/',
  server: {
    https: true,
    port: 5173,

    proxy: {
      '/api': {
        target: 'https://localhost:7265',
        changeOrigin: true,
        secure: false,

        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
