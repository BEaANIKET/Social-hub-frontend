import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy: {
      '/api' : 'https://social-hub-a7l7.onrender.com'
    },
  },
  plugins: [react()],
});
