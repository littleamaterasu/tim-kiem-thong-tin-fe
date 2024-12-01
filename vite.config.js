import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '192.168.0.103', // Change this to your local network IP
    port: 5173,            // This is the default port Vite uses
    strictPort: true       // Will fail if the port is already in use
  }
})
