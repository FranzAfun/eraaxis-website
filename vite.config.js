import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Pinned and strict: certificate QR codes encode a single URL, and locally
    // that is <WEBSITE_URL>/certificates/verify on port 5174. If Vite silently
    // fell back to the next free port, every locally generated QR would point
    // at a port nothing is serving. Failing to start is the louder, correcter
    // outcome — free 5174, or set WEBSITE_URL in the EDOS server env to match.
    port: 5174,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
