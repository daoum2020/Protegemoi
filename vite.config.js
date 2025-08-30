import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: { manualChunks: undefined }
    }
  }
})
