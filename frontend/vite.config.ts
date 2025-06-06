import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  preview: {
    port: 3030,
    host: true,
    allowedHosts: ['helloschool.sohan-birotheau.fr'],
  },
})
