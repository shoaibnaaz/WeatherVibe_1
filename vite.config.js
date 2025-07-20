import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build optimizations
  build: {
    // Reduce bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion'],
          utils: ['axios']
        }
      }
    },
    
    // Faster builds
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    
    // Optimize chunk size
    chunkSizeWarningLimit: 1000
  },
  
  // Development optimizations
  server: {
    hmr: true,
    port: 3000
  },
  
  // Pre-bundle dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'axios']
  }
}) 