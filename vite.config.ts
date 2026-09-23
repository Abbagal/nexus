import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Served from https://abbagal.github.io/nexus/ on GitHub Pages
  base: command === 'build' ? '/nexus/' : '/',
}))
