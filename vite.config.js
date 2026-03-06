import react from '@vitejs/plugin-react'
import {defineConfig} from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/tasks': 'http://localhost:8080',
      '/users': 'http://localhost:8080',
      '/actuator': 'http://localhost:8080'
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setupTests.js',
    globals: true,
    css: true,
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
  }
})
