/// <reference types="vitest/config" />
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

const require = createRequire(import.meta.url);
const cryptoIcons = join(dirname(require.resolve('cryptocurrency-icons/package.json')), 'svg/color');

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: { alias: { '@crypto-icons': cryptoIcons } },
  envPrefix: 'REACT_APP_',
  build: { outDir: 'build' },
  server: { port: 3000 },
  test: { environment: 'jsdom', globals: true },
});
