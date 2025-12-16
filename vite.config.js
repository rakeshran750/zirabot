import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['05ca5a7d6bb6.ngrok-free.app'], // ✅ allow Ngrok host here
  },
})
