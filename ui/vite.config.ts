import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../src/OrderTransformer/wwwroot'),
    emptyOutDir: true,
  },
})
