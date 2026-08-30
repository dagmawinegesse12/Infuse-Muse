import { defineConfig } from 'vitest/config';
import reactPlugin from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  // Cast: vitest resolves its own nested copy of vite, so the plugin object is
  // structurally identical but nominally a different Plugin type.
  plugins: [reactPlugin()] as never,
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
  test: {
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    // Node for route handlers and pure logic; jsdom for anything that renders.
    environmentMatchGlobs: [
      ['tests/server/**', 'node'],
      ['tests/**', 'jsdom'],
    ],
    include: ['tests/**/*.test.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'html'],
      include: ['lib/**', 'components/**', 'app/api/**'],
    },
  },
});
