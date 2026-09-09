import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Serve on the LAN as well as localhost, so a phone on the same network can
    // open the site and scan a certificate QR code end to end. Pair this with a
    // relative VITE_API_URL (/api/website) so API calls go through the proxy
    // below on whatever origin the device used — an absolute localhost API URL
    // would resolve to the phone itself.
    host: true,
    // Pinned and strict: certificate QR codes encode a single URL, and locally
    // that is <WEBSITE_URL>/certificates/verify on port 5174. If Vite silently
    // fell back to the next free port, every locally generated QR would point
    // at a port nothing is serving. Failing to start is the louder, correcter
    // outcome — free 5174, or set WEBSITE_URL in the EDOS server env to match.
    port: 5174,
    strictPort: true,
    proxy: {
      // The proxy runs on the development machine, so localhost here is correct
      // even when the browser is a phone on the LAN.
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
