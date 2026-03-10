import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3003",
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    exclude: [
      '**/node_modules/**',
      '**/playwright_blogtesting/**', // This line so vitest doesn't try to run playwright tests
      '**/dist/**'
    ],
    globals: true,
    setupFiles: './testSetup.js',
  }
})
