import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false, // Vypne HMR overlay pro chyby
    },
  },
  build: {
    rollupOptions: {
      external: ['/uploads/*'], // Ignoruje soubory ve složce uploads
    },
  },
})
