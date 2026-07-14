import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In dev, proxy the API + SSE stream to the Node server on :4000.
// In the real demo the built app is served BY that server (same origin).
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    open: false,
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
})
