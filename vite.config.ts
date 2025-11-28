import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ============= Vite Configuration =============
export default defineConfig({
  plugins: [react()],
  server: {
    // bind on all interfaces (true) so 127.0.0.1 and localhost work; controlled by CLI/env when needed
    host: true,
    port: Number(process.env.PORT) || 5173,
    // allow falling back to another port if occupied (set to true/false via env)
    strictPort: process.env.VITE_STRICT_PORT === 'true' || false,
    // hint HMR host to prefer IPv4 loopback when needed
    hmr: {
      host: process.env.HMR_HOST || '127.0.0.1'
    }
  },
  preview: {
    host: true,
    port: 5173
  }
})
