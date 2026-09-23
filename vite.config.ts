import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vercel serves from the root; the GitHub Pages workflow sets BASE_PATH=/nexus/
  base: process.env.BASE_PATH || '/',
})
