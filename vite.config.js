import react from '@vitejs/plugin-react'
import {defineConfig} from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/tasks': 'http://localhost:8080',
      '/users': 'http://localhost:8080',
      '/actuator': 'http://localhost:8080'
    }
  }
})
