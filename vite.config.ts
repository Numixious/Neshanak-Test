import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Vercel makes its environment variables available to the build step.
    // This defines a global `process.env.API_KEY` that will be replaced
    // with the actual value of the API_KEY environment variable during build.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})
