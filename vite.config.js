import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 4173,
  },
})
