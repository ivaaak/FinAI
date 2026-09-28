import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: Number(env.PORT) || 5173,
      // Dev proxy: the frontend calls relative /api/* URLs and Vite forwards them to the backend.
      proxy: {
        '/api': env.API_TARGET || 'http://localhost:3000',
      },
    },
  };
});
