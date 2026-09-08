import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file from the project root directory (one level up)
  const env = loadEnv(mode, '../', '')

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    define: {
      'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(
        env.GOOGLE_CLIENT_ID || env.VITE_GOOGLE_CLIENT_ID || ''
      )
    }
  }
})
