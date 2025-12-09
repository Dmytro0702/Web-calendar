import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_PORT = env.VITE_API_PORT || '4000';
  const API_HOST = env.VITE_API_HOST || 'http://127.0.0.1';

  return {
    plugins: [svgr({ include: ['**/*.svg?react'] }), react()],
    resolve: {
      alias: {
        '@app': path.resolve(__dirname, 'src/app'),
        '@shared': path.resolve(__dirname, 'src/shared'),
        '@entities': path.resolve(__dirname, 'src/entities'),
        '@features': path.resolve(__dirname, 'src/features'),
        '@widgets': path.resolve(__dirname, 'src/widgets'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@uikit': path.resolve(__dirname, 'src/shared/uikit'),
        '@assets': path.resolve(__dirname, 'src/shared/assets'),
        '@utils': path.resolve(__dirname, 'src/shared/utils'),
        '@hooks': path.resolve(__dirname, 'src/shared/hooks'),
        '@styles': path.resolve(__dirname, 'src/shared/styles'),
        '@time': path.resolve(__dirname, 'src/time'),
        '@types': path.resolve(__dirname, 'src/types'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: `${API_HOST}:${API_PORT}`,
          changeOrigin: true,
          // главное изменение: убираем префикс /api перед отправкой на Express
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    css: {
      modules: { localsConvention: 'camelCase' },
      preprocessorOptions: {
        scss: { api: 'modern-compiler' },
        sass: { api: 'modern-compiler' },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['src/**/*.test.{ts,tsx}'],
      setupFiles: ['src/tests/setupTests.ts'],
    },
  };
});
