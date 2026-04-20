import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:8000',
      '/quests': 'http://localhost:8000',
      '/checkins': 'http://localhost:8000',
      '/achievements': 'http://localhost:8000',
      '/social': 'http://localhost:8000',
    }
  }
})
