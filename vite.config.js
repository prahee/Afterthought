import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import eslint from 'vite-plugin-eslint2'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // eslint() // Disabled for development to avoid blocking style issues
  ],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  // build: {
  //   rollupOptions: {
  //     external: [ 'jquery ']
  //   }
  // }
})
