import * as path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import watchAndRun from 'vite-plugin-watch-and-run';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    watchAndRun([
      {
        name: 'gen',
        watchKind: ['add', 'change', 'unlink'],
        watch: path.resolve('src/**/*.scss'),
        run: 'yarn copy-css',
        delay: 300
      }
    ])
  ],
  build: {
    outDir: 'build',
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  css: {
    modules: {
      localsConvention: 'dashes',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@use '@scssVariables' as *;`
      },
    }
  },
  resolve: {
    alias: {
      '@scssVariables': path.resolve(__dirname, 'assets/scss/variables/index.scss'),
      '@api': path.resolve(__dirname, 'ts-built/api'),
      '@components': path.resolve(__dirname, 'ts-built/components'),
      '@i18n': path.resolve(__dirname, 'ts-built/i18n'),
      '@lib': path.resolve(__dirname, 'ts-built/lib'),
      '@services': path.resolve(__dirname, 'ts-built/services'),
    }
  },
});
